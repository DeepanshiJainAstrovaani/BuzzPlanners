/* eslint-disable @typescript-eslint/no-unused-vars  */
/* eslint-disable react-hooks/exhaustive-deps  */

'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IoPencilOutline, IoTrashOutline, IoAddOutline } from 'react-icons/io5';
import { GrEdit } from "react-icons/gr";
import styles from './VendorMasterSheet.module.css';

interface VendorRow {
  [key: string]: string | number;
}

interface ColumnMeta {
  id: string;
  name: string;
}

interface Section {
  _id?: string;
  key: string;
  label: string;
  type: 'table' | string;
  // Legacy fields
  columns: string[];
  rows: VendorRow[];
  // New fields to make columns stable
  columnsMeta?: ColumnMeta[];
  rowsByColId?: Record<string, string>[];
}

interface WeddingResp {
  _id: string;
  weddingId: string;
  title: string;
  sections?: Section[];
}

const DEFAULT_COLUMNS = [
  'Item',
  'Status',
  'Advance',
  'Cost',
  'Pending',
  'Vendor',
  'Vendor Contact',
];

// Simple unique id generator (works in browsers without crypto.randomUUID)
const uid = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `col_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);

export default function VendorMasterSheetPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const justSavedTimer = useRef<number | null>(null);
  const [wedding, setWedding] = useState<WeddingResp | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [filter, setFilter] = useState('');

  // Debounced autosave timer
  const saveTimer = useRef<number | null>(null);
  const schedulePersist = (meta: ColumnMeta[], rows: Record<string, string>[], delay = 600) => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      persistSection(meta, rows);
    }, delay);
  };

  // Stable columns and rows-by-id kept locally for editing/rendering
  const [columnsMeta, setColumnsMeta] = useState<ColumnMeta[]>([]);
  const [rowsByColId, setRowsByColId] = useState<Record<string, string>[]>([]);

  // Row editing index toggle
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // New row inputs (maps colId -> value)
  const [newRow, setNewRow] = useState<Record<string, string>>({});

  // Header (columns) editing
  const [editHeaderOpen, setEditHeaderOpen] = useState(false);
  const [columnsDraft, setColumnsDraft] = useState<ColumnMeta[]>([]);

  // Convert legacy structure to id-based structure
  const legacyToIdRows = (legacyRows: VendorRow[], meta: ColumnMeta[]) => {
    return (legacyRows || []).map((r) => {
      const rowById: Record<string, string> = {};
      meta.forEach((cm) => {
        rowById[cm.id] = String(r[cm.name] ?? '');
      });
      return rowById;
    });
  };

  // Ensure a row has all current colIds
  const ensureRowShapeByIds = (row: Record<string, string>, meta: ColumnMeta[]) => {
    const shaped: Record<string, string> = {};
    meta.forEach((cm) => {
      shaped[cm.id] = row[cm.id] ?? '';
    });
    return shaped;
  };

  // Build legacy structure for saving/back-compat
  const buildLegacyFromId = (meta: ColumnMeta[], idRows: Record<string, string>[]) => {
    const columns = meta.map((m) => m.name);
    const rows = idRows.map((r) => {
      const obj: VendorRow = {};
      meta.forEach((cm) => {
        obj[cm.name] = r[cm.id] ?? '';
      });
      return obj;
    });
    return { columns, rows };
  };

  // Helper to load from server fresh (no auto-save)
  const loadFromServer = async (weddingMongoId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weddings/${weddingMongoId}`, { cache: 'no-store' });
      const data: WeddingResp = await res.json();
      if (!res.ok) throw new Error('Failed to fetch wedding');
      setWedding(data);
      const found = (data.sections || []).find((s) => s.label === 'Vendor Master Sheet');
      let nextSection: Section;
      if (found) {
        nextSection = found;
      } else {
        nextSection = {
          key: 'vendorMasterSheet',
          label: 'Vendor Master Sheet',
          type: 'table',
          columns: DEFAULT_COLUMNS,
          rows: [],
        };
      }
      setSection(nextSection);

      // Prepare columnsMeta and rowsByColId, supporting legacy data
      let meta: ColumnMeta[] = [];
      let idRows: Record<string, string>[] = [];
      if (nextSection.columnsMeta && nextSection.columnsMeta.length) {
        meta = nextSection.columnsMeta;
        if (nextSection.rowsByColId && nextSection.rowsByColId.length) {
          idRows = nextSection.rowsByColId;
        } else {
          idRows = legacyToIdRows(nextSection.rows || [], meta);
        }
      } else {
        // Build meta from legacy columns
        const cols = (nextSection.columns && nextSection.columns.length) ? nextSection.columns : DEFAULT_COLUMNS;
        meta = cols.map((name) => ({ id: uid(), name }));
        idRows = legacyToIdRows(nextSection.rows || [], meta);
      }

      setColumnsMeta(meta);
      setRowsByColId(idRows);
      setColumnsDraft(meta.map((m) => ({ ...m })));
    } catch (e) {
      console.error('[VendorMasterSheet] Failed to load:', e);
      alert('Failed to load wedding data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadFromServer(id);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      if (justSavedTimer.current) window.clearTimeout(justSavedTimer.current);
    };
  }, [id]);

  const filteredRows = useMemo(() => {
    if (!columnsMeta.length) return [] as Record<string, string>[];
    const q = filter.trim().toLowerCase();
    if (!q) return rowsByColId;

    const scoreRow = (row: Record<string, string>) => {
      let score = 0;
      for (const cm of columnsMeta) {
        const v = String(row[cm.id] ?? '').toLowerCase();
        if (!v) continue;
        if (v === q) score += 3; // exact cell match
        else if (v.startsWith(q)) score += 2; // prefix match
        else if (v.includes(q)) score += 1; // substring match
      }
      return score;
    };

    return rowsByColId
      .map((row, idx) => ({ row, idx, score: scoreRow(row) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => (b.score - a.score) || (a.idx - b.idx))
      .map((r) => r.row);
  }, [filter, rowsByColId, columnsMeta]);
  
  // Exclude any column that looks like a serial number from Add Row inputs
  const inputColumns = useMemo(() => {
    const serialRegex = /^s\s*\.?\s*no\.?$/i; // matches: s no, s.no, s. no, s no.
    return columnsMeta.filter((c) => !serialRegex.test((c.name || '').trim()));
  }, [columnsMeta]);
  // Columns to display in table (hide any S.No-like column; we show our own index column)
  const displayColumns = inputColumns;

  const persistSection = async (meta: ColumnMeta[], idRows: Record<string, string>[]) => {
    if (!wedding) return;
    setSaving(true);
    try {
      // Build both id-based and legacy for back-compat
      const legacy = buildLegacyFromId(meta, idRows);
      const sectionToSave: Section = {
        ...(section || { key: 'vendorMasterSheet', label: 'Vendor Master Sheet', type: 'table', columns: [], rows: [] }),
        type: 'table',
        label: 'Vendor Master Sheet',
        key: section?.key || 'vendorMasterSheet',
        columns: legacy.columns,
        rows: legacy.rows,
        columnsMeta: meta,
        rowsByColId: idRows,
      };

      const nextSections = (() => {
        const others = (wedding.sections || []).filter((s) => s.label !== 'Vendor Master Sheet');
        return [...others, sectionToSave];
      })();
      const payload = { ...wedding, sections: nextSections } as any;
      delete payload.__v;

      const res = await fetch(`/api/weddings/${wedding._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated?.error || 'Failed to save');

      // Refresh from server response
      setWedding(updated);
      const saved: Section | undefined = (updated.sections || []).find((s: Section) => s.label === 'Vendor Master Sheet');
      const newMeta = (saved?.columnsMeta && saved.columnsMeta.length) ? saved.columnsMeta : meta;
      let newIdRows: Record<string, string>[];
      if (saved?.rowsByColId && saved.rowsByColId.length) {
        newIdRows = saved.rowsByColId;
      } else if (saved?.rows && saved.rows.length) {
        newIdRows = legacyToIdRows(saved.rows, newMeta);
      } else {
        newIdRows = idRows;
      }
      setSection(saved || sectionToSave);
      setColumnsMeta(newMeta);
      setRowsByColId(newIdRows);
      setColumnsDraft(newMeta.map((m) => ({ ...m })));

      // Pulse "Saved" indicator
      if (justSavedTimer.current) window.clearTimeout(justSavedTimer.current);
      setJustSaved(true);
      justSavedTimer.current = window.setTimeout(() => setJustSaved(false), 1200);
    } catch (e) {
      console.error('[VendorMasterSheet] Save failed:', e);
      alert('Failed to save Vendor Master Sheet.');
    } finally {
      setSaving(false);
    }
  };

  const openHeaderEdit = () => {
    setColumnsDraft(columnsMeta.map((m) => ({ ...m })));
    setEditHeaderOpen(true);
  };
  const applyHeaderUpdate = () => {
    // Keep ids stable, only update names; filter out empty names
    const cleaned = columnsDraft
      .map((c) => ({ ...c, name: c.name.trim() }))
      .filter((c) => !!c.name);
    if (cleaned.length === 0) return alert('Add at least one column.');

    // Ensure any item missing id (newly added) gets an id
    const normalized = cleaned.map((c) => ({ id: c.id || uid(), name: c.name }));

    // Reshape rows to new columns set (preserve by id)
    const nextRows = rowsByColId.map((r) => ensureRowShapeByIds(r, normalized));

    setColumnsMeta(normalized);
    setRowsByColId(nextRows);
    setColumnsDraft(normalized.map((m) => ({ ...m })));
    setEditHeaderOpen(false);

    // Persist immediately with updated meta and rows
    schedulePersist(normalized, nextRows, 0);
  };

  if (loading || !section) {
    return (
      <div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px #0001' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      {/* Breadcrumb */}
      <div style={{ color: '#0CA04E', fontWeight: 500, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span>Wedding Management / {wedding?.title || ''}</span>
        <span style={{ fontSize: '12px', color: saving ? '#666' : '#0CA04E', opacity: saving || justSaved ? 1 : 0, transition: 'opacity .2s' }}>
          {saving ? 'Saving…' : justSaved ? 'Saved' : ''}
        </span>
      </div>
      <h1 style={{ fontWeight: 600, fontSize: '20px', margin: '30px 0 20px 0' }}>Vendor Master Sheet</h1>

      {/* Search only (autosave enabled) */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 30, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <input
            placeholder="🔎︎  Search any item"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '100%', padding: 'var(--input-pad, 5px 14px)', borderRadius: 8, border: '1px solid #ccc', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: '#EBE9E9', color: '#222' }}>
              <th className='px-2 py-1' style={{ textAlign: 'left', fontSize: '12px', fontWeight: 600 }}>S.No</th>
              {displayColumns.map((cm) => (
                <th className='px-2 py-1' key={cm.id} style={{ textAlign: 'left', fontSize: '12px', fontWeight: 600 }}>{cm.name}</th>
              ))}
              <th className='px-2 py-1' style={{ textAlign: 'left' }}>
                <button
                  onClick={openHeaderEdit}
                  title="Edit columns"
                  style={{ background: 'white', border: 'none', color: '#222', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '4px', borderRadius: 10 }}
                >
                  <GrEdit size={13} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, idx) => (
              <tr key={idx} style={{ background: idx % 2 ? '#eaf7fb' : '#fff' }}>
                <td style={{ padding: '2px 10px', fontWeight: 600, fontSize: '10px' }}>{idx + 1}</td>
                {displayColumns.map((cm) => (
                  <td key={cm.id} style={{ padding: '2px 10px', fontSize: '10px' }}>
                    {editingIndex === idx ? (
                      <input
                        value={String(rowsByColId[idx]?.[cm.id] ?? '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          const next = [...rowsByColId];
                          next[idx] = ensureRowShapeByIds({ ...(next[idx] || {}), [cm.id]: val }, columnsMeta);
                          setRowsByColId(next);
                          schedulePersist(columnsMeta, next);
                        }}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 'var(--input-fs, 15px)' }}
                      />
                    ) : (
                      <span>{String(row[cm.id] ?? '')}</span>
                    )}
                  </td>
                ))}
                <td style={{ padding: 'var(--cell-pad, 12px 12px)', whiteSpace: 'nowrap' }}>
                  <button title={editingIndex === idx ? 'Finish editing' : 'Edit row'} onClick={() => setEditingIndex(editingIndex === idx ? null : idx)} style={{ background: '#fff', color: '#288DD0', marginRight: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none' }}>
                    <GrEdit size={16} />
                  </button>
                  <button title="Delete row" onClick={() => { const next = rowsByColId.filter((_, i) => i !== idx); setRowsByColId(next); schedulePersist(columnsMeta, next); }} style={{ background: 'transparent', color: '#e57373', border: 'none', borderRadius: 6, padding: 'var(--icon-btn-pad, 6px 12px)', fontWeight: 700, fontSize: 'var(--btn-sm-fs, 14px)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <IoTrashOutline size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {/* Add row */}
            <tr>
              <td style={{ padding: 'var(--cell-pad, 12px 12px)', color: '#888' }}>#</td>
              {displayColumns.map((cm) => (
                <td key={cm.id} style={{ padding: 'var(--cell-pad, 12px 12px)' }}>
                  <input
                    value={String(newRow[cm.id] ?? '')}
                    onChange={(e) => setNewRow({ ...newRow, [cm.id]: e.target.value })}
                    style={{ width: '100%', padding: '4px 8px', borderRadius: 6, border: '1px solid #ccc', fontSize: '10px' }}
                  />
                </td>
              ))}
              <td style={{ padding: 'var(--cell-pad, 12px 12px)' }}>
                <button onClick={() => { const shaped = ensureRowShapeByIds(newRow, columnsMeta); const next = [...rowsByColId, shaped]; setRowsByColId(next); setNewRow({}); schedulePersist(columnsMeta, next); }} style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', fontWeight: 700, fontSize: '10px', cursor: 'pointer' }}>Add</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Header edit modal */}
      {editHeaderOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.18)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 18, width: 'min(640px, 96vw)', boxShadow: '0 4px 24px #0002' }} className={styles.modalCard}>
            <div style={{ fontWeight: 700, fontSize: 'var(--tbl-breadcrumb-fs, 16px)', marginBottom: 12 }}>Edit Columns</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {columnsDraft.map((c, idx) => (
                <div key={c.id || idx} style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={c.name}
                    onChange={(e) => {
                      const next = [...columnsDraft];
                      next[idx] = { ...next[idx], name: e.target.value };
                      setColumnsDraft(next);
                    }}
                    style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 'var(--input-fs, 15px)' }}
                  />
                  <button
                    onClick={() => setColumnsDraft(columnsDraft.filter((_, i) => i !== idx))}
                    style={{ background: '#fff', color: '#e57373', border: '1px solid #e57373', borderRadius: 6, padding: 'var(--icon-btn-pad, 6px 12px)', fontWeight: 700, fontSize: 'var(--btn-sm-fs, 14px)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <IoTrashOutline size={16} />
                    Remove
                  </button>
                </div>
              ))}
              <div>
                <button
                  onClick={() => setColumnsDraft([...columnsDraft, { id: '', name: '' }])}
                  style={{ background: '#fff', color: '#2196f3', border: '1px solid #2196f3', borderRadius: 6, padding: 'var(--icon-btn-pad, 6px 12px)', fontWeight: 700, fontSize: 'var(--btn-sm-fs, 14px)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <IoAddOutline size={16} />
                  Add column
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setEditHeaderOpen(false)} style={{ background: '#fff', color: '#222', border: '1px solid #ccc', borderRadius: 6, padding: 'var(--icon-btn-pad, 6px 12px)', fontWeight: 700, fontSize: 'var(--btn-sm-fs, 14px)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={applyHeaderUpdate} style={{ background: '#1abc5b', color: '#fff', border: 'none', borderRadius: 6, padding: 'var(--icon-btn-pad, 6px 12px)', fontWeight: 700, fontSize: 'var(--btn-sm-fs, 14px)', cursor: 'pointer' }}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Remove custom alert bar styles; native dialogs are used
// ...existing code...

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: '12px',
  boxShadow: '0 4px 20px #0002',
  width: 'min(520px, 92vw)',
};
