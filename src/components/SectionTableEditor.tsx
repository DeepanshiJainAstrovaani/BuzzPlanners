'use client';

import { IoPencilOutline, IoTrashOutline, IoAddOutline, IoChevronUpOutline, IoChevronDownOutline, IoCheckmarkOutline } from 'react-icons/io5';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SectionTableEditor.module.css';
import { GrEdit } from "react-icons/gr";

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

const uid = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `col_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);

function titleCaseFromKey(key: string) {
  return key
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Ensure the very first character is uppercase regardless of source casing
function capitalizeFirst(s: string) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function SectionTableEditor({ weddingMongoId, sectionKey }: { weddingMongoId: string; sectionKey: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const justSavedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [wedding, setWedding] = useState<WeddingResp | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [filter, setFilter] = useState('');

  // Debounced autosave timer
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [columnsMeta, setColumnsMeta] = useState<ColumnMeta[]>([]);
  const [rowsByColId, setRowsByColId] = useState<Record<string, string>[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [newRow, setNewRow] = useState<Record<string, string>>({});

  const [editHeaderOpen, setEditHeaderOpen] = useState(false);
  const [columnsDraft, setColumnsDraft] = useState<ColumnMeta[]>([]);

  const legacyToIdRows = (legacyRows: VendorRow[], meta: ColumnMeta[]) => {
    return (legacyRows || []).map((r) => {
      const rowById: Record<string, string> = {};
      meta.forEach((cm) => {
        rowById[cm.id] = String(r[cm.name] ?? '');
      });
      return rowById;
    });
  };

  const ensureRowShapeByIds = (row: Record<string, string>, meta: ColumnMeta[]) => {
    const shaped: Record<string, string> = {};
    meta.forEach((cm) => {
      shaped[cm.id] = row[cm.id] ?? '';
    });
    return shaped;
  };

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

  const scheduleAutosave = (meta: ColumnMeta[] = columnsMeta, idRows: Record<string, string>[] = rowsByColId) => {
    if (!wedding) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      persistSection(meta, idRows);
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      if (justSavedTimer.current) clearTimeout(justSavedTimer.current);
    };
  }, []);

  const loadFromServer = async (mongoId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/weddings/${mongoId}`, { cache: 'no-store' });
      const data: WeddingResp = await res.json();
      if (!res.ok) throw new Error('Failed to fetch wedding');
      setWedding(data);

      // Find section by key (preferred) or by label fallback
      const keyMatch = (data.sections || []).find((s) => s.key === sectionKey);
      const labelGuess = titleCaseFromKey(sectionKey);
      const labelMatch = (data.sections || []).find((s) => s.label?.toLowerCase() === labelGuess.toLowerCase());
      const found = keyMatch || labelMatch;

      let nextSection: Section;
      if (found) {
        nextSection = found;
      } else {
        nextSection = {
          key: sectionKey,
          label: labelGuess,
          type: 'table',
          columns: DEFAULT_COLUMNS,
          rows: [],
        };
      }
      setSection(nextSection);

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
        const cols = (nextSection.columns && nextSection.columns.length) ? nextSection.columns : DEFAULT_COLUMNS;
        meta = cols.map((name) => ({ id: uid(), name }));
        idRows = legacyToIdRows(nextSection.rows || [], meta);
      }

      setColumnsMeta(meta);
      setRowsByColId(idRows);
      setColumnsDraft(meta.map((m) => ({ ...m })));
    } catch (e) {
      console.error('[SectionTableEditor] Failed to load:', e);
      alert('Failed to load section data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (weddingMongoId) loadFromServer(weddingMongoId);
  }, [weddingMongoId, sectionKey]);

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

  const inputColumns = useMemo(() => {
    const serialRegex = /^s\s*\.?\s*no\.?$/i;
    return columnsMeta.filter((c) => !serialRegex.test((c.name || '').trim()));
  }, [columnsMeta]);
  const displayColumns = inputColumns;

  const persistSection = async (meta: ColumnMeta[], idRows: Record<string, string>[]) => {
    if (!wedding) return;
    setSaving(true);
    try {
      const legacy = buildLegacyFromId(meta, idRows);
      const currentLabel = section?.label || titleCaseFromKey(sectionKey);
      const sectionToSave: Section = {
        ...(section || { key: sectionKey, label: currentLabel, type: 'table', columns: [], rows: [] }),
        type: 'table',
        label: currentLabel,
        key: sectionKey,
        columns: legacy.columns,
        rows: legacy.rows,
        columnsMeta: meta,
        rowsByColId: idRows,
      };

      const nextSections = (() => {
        const others = (wedding.sections || []).filter((s) => s.key !== sectionKey && s.label?.toLowerCase() !== currentLabel.toLowerCase());
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

      setWedding(updated);
      const saved: Section | undefined = (updated.sections || []).find((s: Section) => s.key === sectionKey || s.label?.toLowerCase() === currentLabel.toLowerCase());
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
      if (justSavedTimer.current) clearTimeout(justSavedTimer.current);
      setJustSaved(true);
      justSavedTimer.current = setTimeout(() => setJustSaved(false), 1200);
    } catch (e) {
      console.error('[SectionTableEditor] Save failed:', e);
      alert('Failed to save section.');
    } finally {
      setSaving(false);
    }
  };

  const startEditRow = (idx: number) => {
    setEditingIndex(idx);
  };
  const finishEditRow = () => {
    setEditingIndex(null);
  };
  const deleteRow = (idx: number) => {
    const nextRows = rowsByColId.filter((_, i) => i !== idx);
    setRowsByColId(nextRows);
    scheduleAutosave(columnsMeta, nextRows);
  };
  const addRow = () => {
    const shaped = ensureRowShapeByIds(newRow, columnsMeta);
    const nextRows = [...rowsByColId, shaped];
    setRowsByColId(nextRows);
    setNewRow({});
    scheduleAutosave(columnsMeta, nextRows);
  };

  const openHeaderEdit = () => {
    setColumnsDraft(columnsMeta.map((m) => ({ ...m })));
    setEditHeaderOpen(true);
  };
  const applyHeaderUpdate = () => {
    const cleaned = columnsDraft
      .map((c) => ({ ...c, name: c.name.trim() }))
      .filter((c) => !!c.name);
    if (cleaned.length === 0) return alert('Add at least one column.');

    const normalized = cleaned.map((c) => ({ id: c.id || uid(), name: c.name }));
    const nextRows = rowsByColId.map((r) => ensureRowShapeByIds(r, normalized));

    setColumnsMeta(normalized);
    setRowsByColId(nextRows);
    setColumnsDraft(normalized.map((m) => ({ ...m })));
    setEditHeaderOpen(false);
    scheduleAutosave(normalized, nextRows);
  };

  if (loading || !section) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minHeight: 200 }}>Loading...</div>
    );
  }

  const heading = capitalizeFirst(section?.label || titleCaseFromKey(sectionKey));

  return (
    <div className={styles.editor}>
      {/* Breadcrumb */}
      <div style={{ color: '#0CA04E', fontWeight: 500, fontSize: '12px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span>Wedding Management / {wedding?.title || ''} / {heading}</span>
        <span aria-live="polite" style={{ fontSize: '12px', color: saving ? '#666' : '#0CA04E', opacity: saving || justSaved ? 1 : 0, transition: 'opacity .2s' }}>
          {saving ? 'Saving…' : justSaved ? 'Saved' : ''}
        </span>
      </div>
      <h1 style={{ fontWeight: 600, fontSize: '20px', margin: '30px 0 20px 0' }}>{heading}</h1>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 30, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
          <input
            placeholder="🔎︎  Search any item"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '100%', padding: '5px 10px', borderRadius: 8, border: '1px solid #ccc', fontSize: '13px' }}
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
                <td style={{ padding: 'var(--cell-pad, 12px 12px)', fontWeight: 600, fontSize: '10px' }}>{idx + 1}</td>
                {displayColumns.map((cm) => (
                  <td key={cm.id} style={{ padding: 'var(--cell-pad, 12px 12px)', fontSize: '10px' }}>
                    {editingIndex === idx ? (
                      <input
                        value={String(rowsByColId[idx]?.[cm.id] ?? '')}
                        onChange={(e) => {
                          const next = [...rowsByColId];
                          next[idx] = { ...next[idx], [cm.id]: e.target.value };
                          setRowsByColId(next);
                          scheduleAutosave(columnsMeta, next);
                        }}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6, fontSize: 'var(--input-fs, 15px)' }}
                      />
                    ) : (
                      <span>{String(row[cm.id] ?? '')}</span>
                    )}
                  </td>
                ))}
                <td style={{ padding: 'var(--cell-pad, 12px 12px)', whiteSpace: 'nowrap' }}>
                  {/* Toggle edit/done for consistency with VendorMasterSheet */}
                  <button onClick={() => setEditingIndex(editingIndex === idx ? null : idx)} title={editingIndex === idx ? 'Done' : 'Edit row'} style={{ background: 'transparent', color: '#288DD0', marginRight: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none' }}>
                    {editingIndex === idx ? <IoCheckmarkOutline size={16} /> : <GrEdit size={16} />}
                  </button>
                  <button onClick={() => deleteRow(idx)} title="Delete row" style={{ background: 'transparent', color: '#e57373', border: 'none', borderRadius: 6, padding: 'var(--icon-btn-pad, 6px 12px)', fontWeight: 700, fontSize: 'var(--btn-sm-fs, 14px)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <IoTrashOutline size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {/* Add row */}
            <tr>
              <td style={{ padding: 'var(--cell-pad, 12px 12px)', color: '#888' }}>#</td>
              {displayColumns.map((cm) => (
                <td key={cm.id} style={{ padding: 'var(--cell-pad, 12px 12px' }}>
                  <input
                    value={String(newRow[cm.id] ?? '')}
                    onChange={(e) => setNewRow({ ...newRow, [cm.id]: e.target.value })}
                    style={{ width: '100%', padding: '8px 8px', borderRadius: 6, border: '1px solid #ccc', fontSize: '10px' }}
                  />
                </td>
              ))}
              <td style={{ padding: 'var(--cell-pad, 12px 12px)' }}>
                <button onClick={() => { const shaped = ensureRowShapeByIds(newRow, columnsMeta); const next = [...rowsByColId, shaped]; setRowsByColId(next); setNewRow({}); scheduleAutosave(columnsMeta, next); }} style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 700, fontSize: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <IoAddOutline size={14} />
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Header edit modal */}
      {editHeaderOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle} className={styles.modalCard}>
            <div style={{ color: '#1abc5b', fontWeight: 500, fontSize: 'var(--tbl-breadcrumb-fs, 16px)', marginBottom: 8 }}>
              Wedding Management / {wedding?.weddingId || ''} / {heading}
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 'var(--modal-title-fs, 26px)', margin: '16px 0 24px 0' }}>{heading} table</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {columnsDraft.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    placeholder={`Column ${i + 1}`}
                    value={c.name}
                    onChange={(e) => {
                      const copy = [...columnsDraft];
                      copy[i] = { ...copy[i], name: e.target.value };
                      setColumnsDraft(copy);
                    }}
                    style={{ flex: 1, padding: '14px 16px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 'var(--input-fs, 16px)' }}
                  />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      title="Move up"
                      disabled={i === 0}
                      onClick={() => {
                        if (i === 0) return;
                        const copy = [...columnsDraft];
                        const temp = copy[i - 1];
                        copy[i - 1] = copy[i];
                        copy[i] = temp;
                        setColumnsDraft(copy);
                      }}
                      style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '8px 10px', cursor: i === 0 ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center' }}
                    >
                      <IoChevronUpOutline size={16} />
                    </button>
                    <button
                      title="Move down"
                      disabled={i === columnsDraft.length - 1}
                      onClick={() => {
                        if (i === columnsDraft.length - 1) return;
                        const copy = [...columnsDraft];
                        const temp = copy[i + 1];
                        copy[i + 1] = copy[i];
                        copy[i] = temp;
                        setColumnsDraft(copy);
                      }}
                      style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '8px 10px', cursor: i === columnsDraft.length - 1 ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center' }}
                    >
                      <IoChevronDownOutline size={16} />
                    </button>
                    <button
                      title="Delete column"
                      onClick={() => {
                        const copy = columnsDraft.filter((_, idx) => idx !== i);
                        setColumnsDraft(copy);
                      }}
                      style={{ background: '#fff', border: '1px solid #e57373', color: '#e57373', borderRadius: 6, padding: '8px 10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <IoTrashOutline size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
              <button onClick={() => setColumnsDraft([...columnsDraft, { id: uid(), name: '' }])} style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 'var(--btn-fs, 16px)', padding: '10px 24px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <IoAddOutline size={18} />
                Add field
              </button>
              <button onClick={applyHeaderUpdate} disabled={saving} style={{ background: '#1abc5b', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 'var(--btn-fs, 16px)', padding: '10px 24px', cursor: 'pointer' }}>Update</button>
              <button onClick={() => setEditHeaderOpen(false)} style={{ background: '#fff', color: '#222', border: '1.5px solid #ccc', borderRadius: 8, fontWeight: 700, fontSize: 'var(--btn-fs, 16px)', padding: '10px 24px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
