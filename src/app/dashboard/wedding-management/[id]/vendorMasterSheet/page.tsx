'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  const [wedding, setWedding] = useState<WeddingResp | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [filter, setFilter] = useState('');
  const [dirty, setDirty] = useState(false);
  
  const bypassGuardRef = useRef(false);

  // Warn on tab close/refresh when there are unsaved changes
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);

  // Stable columns and rows-by-id kept locally for editing/rendering
  const [columnsMeta, setColumnsMeta] = useState<ColumnMeta[]>([]);
  const [rowsByColId, setRowsByColId] = useState<Record<string, string>[]>([]);

  // Row editing (maps colId -> value)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<Record<string, string>>({});

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
      setDirty(false); // fresh state from server
    } catch (e) {
      console.error('[VendorMasterSheet] Failed to load:', e);
      alert('Failed to load wedding data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadFromServer(id);
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
      setDirty(false);
    } catch (e) {
      console.error('[VendorMasterSheet] Save failed:', e);
      alert('Failed to save Vendor Master Sheet.');
    } finally {
      setSaving(false);
    }
  };

  const startEditRow = (idx: number) => {
    setEditingIndex(idx);
    setEditedRow(ensureRowShapeByIds(rowsByColId[idx] || {}, columnsMeta));
  };
  const cancelEditRow = () => {
    setEditingIndex(null);
    setEditedRow({});
  };
  const saveRow = () => {
    if (editingIndex === null) return;
    const nextRows = [...rowsByColId];
    nextRows[editingIndex] = ensureRowShapeByIds(editedRow, columnsMeta);
    setRowsByColId(nextRows);
    setEditingIndex(null);
    setEditedRow({});
    setDirty(true);
  };
  const deleteRow = (idx: number) => {
    const nextRows = rowsByColId.filter((_, i) => i !== idx);
    setRowsByColId(nextRows);
    setDirty(true);
  };
  const addRow = () => {
    const shaped = ensureRowShapeByIds(newRow, columnsMeta);
    setRowsByColId([...rowsByColId, shaped]);
    setNewRow({});
    setDirty(true);
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
    setDirty(true);
  };

  // Internal navigation guard for unsaved changes - use native confirm
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!dirty) return;
      // Only intercept unmodified left-clicks
      const mouseEvent = e as MouseEvent & { metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; button?: number };
      if (mouseEvent.metaKey || mouseEvent.ctrlKey || mouseEvent.shiftKey || mouseEvent.button !== 0) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) return; // in-page anchors
      if (!href || anchor.target === '_blank') return;
      // Only warn for same-origin links
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.href === window.location.href) return;

      // Ask first, then block if user cancels. Because this runs in capture phase,
      // we can stop propagation to prevent Next.js Link handlers from pushing state.
      const ok = window.confirm('You have unsaved changes. Do you want to leave without saving?');
      if (!ok) {
        e.preventDefault();
        (e as any).stopImmediatePropagation?.();
        e.stopPropagation();
        return;
      }
      // If ok, allow normal navigation (SPA or full page) to proceed.
    };
    document.addEventListener('click', onDocClick, { capture: true });
    return () => document.removeEventListener('click', onDocClick, { capture: true } as any);
  }, [dirty]);

  // Intercept SPA navigations (router.push/replace) by patching history APIs - native confirm
  useEffect(() => {
     const origPushState = history.pushState;
     const origReplaceState = history.replaceState;

     const guard = (fn: typeof history.pushState) =>
       function (this: History, ...args: Parameters<typeof history.pushState>) {
        if (bypassGuardRef.current) {
          bypassGuardRef.current = false;
          return fn.apply(this, args as any);
        }
        if (dirty) {
          const ok = window.confirm('You have unsaved changes. Do you want to leave without saving?');
          if (!ok) return;
        }
        return fn.apply(this, args as any);
       } as typeof history.pushState;

     history.pushState = guard(origPushState);
     history.replaceState = guard(origReplaceState);

     // Handle back/forward buttons - native confirm
     const onPopState = (e: PopStateEvent) => {
      if (bypassGuardRef.current) {
        bypassGuardRef.current = false;
        return;
      }
      if (!dirty) return;
      const ok = window.confirm('You have unsaved changes. Do you want to leave without saving?');
      if (!ok) {
        // Prevent other listeners (like Next.js Router) from handling this popstate
        (e as any).stopImmediatePropagation?.();
        e.stopPropagation();
        // Revert the back/forward by immediately moving forward
        bypassGuardRef.current = true;
        history.go(1);
      }
     };
     window.addEventListener('popstate', onPopState, { capture: true });

     return () => {
       history.pushState = origPushState;
       history.replaceState = origReplaceState;
       window.removeEventListener('popstate', onPopState, { capture: true } as any);
     };
   }, [dirty]);

  if (loading || !section) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f7f7' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }}>
          <DashboardHeader />
        </div>
        <div style={{ position: 'fixed', top: 72, left: 0, height: 'calc(100vh - 72px)', width: 240, zIndex: 99 }}>
          <DashboardSidebar />
        </div>
        <main style={{ marginLeft: 240, marginTop: 72, flex: 1, padding: '40px 48px 0 48px' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 40, boxShadow: '0 2px 8px #0001' }}>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7' }}>
      {/* Fixed Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100 }}>
        <DashboardHeader />
      </div>
      {/* Fixed Sidebar */}
      <div style={{ position: 'fixed', top: 72, left: 0, height: 'calc(100vh - 72px)', width: 240, zIndex: 99 }}>
        <DashboardSidebar />
      </div>
      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <div>
          {/* Breadcrumb */}
          <div style={{ color: '#1abc5b', fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
            Wedding Management / {wedding?.title || ''}
          </div>
          <h1 style={{ fontWeight: 500, fontSize: 28, margin: '30px 0 35px 0' }}>Vendor Master Sheet</h1>

          {/* Search + header edit and global actions */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 30 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                placeholder="🔍︎  Search any item"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #ccc', fontSize: 16 }}
              />
            </div>
            <button
              onClick={() => persistSection(columnsMeta, rowsByColId)}
              disabled={saving || !dirty}
              style={{ background: dirty ? '#1abc5b' : '#a5d6a7', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, padding: '10px 18px', cursor: dirty ? 'pointer' : 'not-allowed' }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => wedding && loadFromServer(wedding._id)}
              disabled={saving || !dirty}
              style={{ background: '#fff', color: dirty ? '#e57373' : '#bbb', border: `1.5px solid ${dirty ? '#e57373' : '#ddd'}`, borderRadius: 8, fontWeight: 700, fontSize: 15, padding: '10px 18px', cursor: dirty ? 'pointer' : 'not-allowed' }}
            >
              Discard
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#555555', color: 'white'}}>
                  <th style={{ textAlign: 'left', padding: '12px 12px'}}>S.No</th>
                  {displayColumns.map((cm) => (
                    <th key={cm.id} style={{ textAlign: 'left', padding: '12px 12px' }}>{cm.name}</th>
                  ))}
                  <th style={{ textAlign: 'left', padding: '12px 12px' }}>
                    <button
              onClick={openHeaderEdit}
              title="Edit columns"
              style={{ background: '#555555', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <Image src="/icons/edit.png" alt="edit" width={20} height={20} />
            </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 ? '#eaf7fb' : '#fff' }}>
                    <td style={{ padding: '12px 12px', fontWeight: 700 }}>{idx + 1}</td>
                    {displayColumns.map((cm) => (
                      <td key={cm.id} style={{ padding: '12px 12px' }}>
                        {editingIndex === idx ? (
                          <input
                            value={String(editedRow[cm.id] ?? '')}
                            onChange={(e) => {
                              setEditedRow({ ...editedRow, [cm.id]: e.target.value });
                              setDirty(true);
                            }}
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6 }}
                          />
                        ) : (
                          <span>{String(row[cm.id] ?? '')}</span>
                        )}
                      </td>
                    ))}
                    <td style={{ padding: '12px 12px', whiteSpace: 'nowrap' }}>
                      {editingIndex === idx ? (
                        <>
                          <button onClick={saveRow} disabled={saving} style={{ border: '1px solid #4caf50', color: '#4caf50', background: '#fff', borderRadius: 6, padding: '6px 12px', marginRight: 8, cursor: 'pointer' }}>Save</button>
                          <button onClick={cancelEditRow} style={{ border: '1px solid #999', color: '#666', background: '#fff', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditRow(idx)} title="Edit row" style={{ border: '1px solid #2196f3', color: '#2196f3', background: '#fff', borderRadius: 6, padding: '6px 12px', marginRight: 8, cursor: 'pointer' }}>
                            ✏️
                          </button>
                          <button onClick={() => deleteRow(idx)} title="Delete row" style={{ border: '1px solid #e57373', color: '#e57373', background: '#fff', borderRadius: 6, padding: '6px 12px', cursor: 'pointer' }}>
                            <Image src="/icons/delete.png" alt="delete" width={16} height={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add new row */}
          <div style={{ background: '#fff8e1', border: '1px solid #f0e0a0', borderRadius: 8, padding: 15, marginTop: 40 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Adding new row</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${inputColumns.length}, minmax(140px, 1fr))`, gap: 12 }}>
              {inputColumns.map((cm) => (
                <input
                  key={cm.id}
                  placeholder={cm.name}
                  value={String(newRow[cm.id] ?? '')}
                  onChange={(e) => {
                    setNewRow({ ...newRow, [cm.id]: e.target.value });
                    setDirty(true);
                  }}
                  style={{ padding: '10px 12px', borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 15 }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={addRow} disabled={saving} style={{ background: '#1abc5b', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px', marginTop: 12, cursor: 'pointer' }}>
                Add Row
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Header edit modal */}
      {editHeaderOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            {/* Breadcrumb */}
            <div style={{ color: '#1abc5b', fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
              Wedding Management / {wedding?.weddingId || ''} / Vendor Master Sheet
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 26, margin: '16px 0 40px 0' }}>Vendor master sheet table</h2>

            {/* Column inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))', gap: 16 }}>
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
                    style={{ flex: 1, padding: '14px 16px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 16 }}
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
                      style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '8px 10px', cursor: i === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                    >
                      ↑
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
                      style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 6, padding: '8px 10px', cursor: i === columnsDraft.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                    >
                      ↓
                    </button>
                    <button
                      title="Delete column"
                      onClick={() => {
                        const copy = columnsDraft.filter((_, idx) => idx !== i);
                        setColumnsDraft(copy);
                      }}
                      style={{ background: '#fff', border: '1px solid #e57373', color: '#e57373', borderRadius: 6, padding: '8px 10px', cursor: 'pointer' }}
                    >
                      <Image src="/icons/delete.png" alt="delete" width={16} height={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 50 }}>
              <button onClick={() => setColumnsDraft([...columnsDraft, { id: uid(), name: '' }])} style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px', cursor: 'pointer' }}>Add field</button>
              <button onClick={applyHeaderUpdate} disabled={saving} style={{ background: '#1abc5b', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px', cursor: 'pointer' }}>Update</button>
              <button onClick={() => setEditHeaderOpen(false)} style={{ background: '#fff', color: '#222', border: '1.5px solid #ccc', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px', cursor: 'pointer' }}>Cancel</button>
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
  height: '115vh',
  background: 'rgba(0,0,0,0.18)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: '32px 36px',
  boxShadow: '0 4px 32px #0002',
  minWidth: 720,
};
