'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface VendorRow {
  [key: string]: string | number;
}

interface Section {
  _id?: string;
  key: string;
  label: string;
  type: 'table' | string;
  columns: string[];
  rows: VendorRow[];
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

export default function VendorMasterSheetPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wedding, setWedding] = useState<WeddingResp | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [filter, setFilter] = useState('');

  // Row editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<VendorRow>({});

  // New row inputs
  const [newRow, setNewRow] = useState<VendorRow>({});

  // Header (columns) editing
  const [editHeaderOpen, setEditHeaderOpen] = useState(false);
  const [columnsDraft, setColumnsDraft] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/weddings/${id}`, { cache: 'no-store' });
        const data: WeddingResp = await res.json();
        if (!res.ok) throw new Error('Failed to fetch wedding');
        setWedding(data);
        const found = (data.sections || []).find((s) => s.label === 'Vendor Master Sheet');
        if (found) {
          setSection(found);
          setColumnsDraft(found.columns);
        } else {
          const empty: Section = {
            key: 'vendorMasterSheet',
            label: 'Vendor Master Sheet',
            type: 'table',
            columns: DEFAULT_COLUMNS,
            rows: [],
          };
          setSection(empty);
          setColumnsDraft(empty.columns);
        }
      } catch (e) {
        console.error('[VendorMasterSheet] Failed to load:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const filteredRows = useMemo(() => {
    if (!section) return [];
    const q = filter.trim().toLowerCase();
    if (!q) return section.rows || [];
    return (section.rows || []).filter((row) =>
      (section.columns || []).some((col) => String(row[col] ?? '').toLowerCase().includes(q))
    );
  }, [filter, section]);

  const ensureRowShape = (row: VendorRow, columns: string[]) => {
    const shaped: VendorRow = {};
    columns.forEach((c) => {
      shaped[c] = row[c] ?? '';
    });
    return shaped;
  };

  const persistSection = async (nextSection: Section) => {
    if (!wedding) return;
    setSaving(true);
    try {
      const nextSections = (() => {
        const others = (wedding.sections || []).filter((s) => s.label !== 'Vendor Master Sheet');
        return [...others, nextSection];
      })();
      const payload = { ...wedding, sections: nextSections } as any;
      // Clean non-editable fields that backend might not accept
      delete payload.__v;

      const res = await fetch(`/api/weddings/${wedding._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated?.error || 'Failed to save');
      setWedding(updated);
      const saved = (updated.sections || []).find((s: Section) => s.label === 'Vendor Master Sheet');
      setSection(saved || nextSection);
      // reset drafts if header was saved
      setColumnsDraft((saved || nextSection).columns);
    } catch (e) {
      console.error('[VendorMasterSheet] Save failed:', e);
      alert('Failed to save Vendor Master Sheet.');
    } finally {
      setSaving(false);
    }
  };

  const startEditRow = (idx: number) => {
    if (!section) return;
    setEditingIndex(idx);
    setEditedRow(ensureRowShape(section.rows[idx], section.columns));
  };
  const cancelEditRow = () => {
    setEditingIndex(null);
    setEditedRow({});
  };
  const saveRow = async () => {
    if (editingIndex === null || !section) return;
    const rows = [...(section.rows || [])];
    rows[editingIndex] = ensureRowShape(editedRow, section.columns);
    await persistSection({ ...section, rows });
    setEditingIndex(null);
    setEditedRow({});
  };
  const deleteRow = async (idx: number) => {
    if (!section) return;
    const rows = (section.rows || []).filter((_, i) => i !== idx);
    await persistSection({ ...section, rows });
  };
  const addRow = async () => {
    if (!section) return;
    const shaped = ensureRowShape(newRow, section.columns);
    await persistSection({ ...section, rows: [...(section.rows || []), shaped] });
    setNewRow({});
  };

  const openHeaderEdit = () => {
    if (!section) return;
    setColumnsDraft([...(section.columns || [])]);
    setEditHeaderOpen(true);
  };
  const applyHeaderUpdate = async () => {
    if (!section) return;
    const cleaned = columnsDraft.map((c) => c.trim()).filter(Boolean);
    if (cleaned.length === 0) return alert('Add at least one column.');
    // reshape rows to new columns set
    const rows = (section.rows || []).map((r) => ensureRowShape(r, cleaned));
    await persistSection({ ...section, columns: cleaned, rows });
    setEditHeaderOpen(false);
  };

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
      <main style={{ marginLeft: 240, marginTop: 72, flex: 1, padding: '40px 48px 0 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 32 }}>
          {/* Breadcrumb */}
          <div style={{ color: '#1abc5b', fontWeight: 500, fontSize: 16, marginBottom: 8 }}>
            Wedding Management / <span style={{ color: '#2196f3', fontWeight: 700 }}>{wedding?.weddingId || ''}</span> / Vendor Master Sheet
          </div>
          <h1 style={{ fontWeight: 800, fontSize: 28, margin: '8px 0 16px 0' }}>Vendor Master Sheet</h1>

          {/* Search + header edit */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                placeholder="Search any item"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1.5px solid #ccc', fontSize: 16 }}
              />
              <span style={{ position: 'absolute', right: 12, top: 10, color: '#999' }}>🔍︎</span>
            </div>
            <button
              onClick={openHeaderEdit}
              title="Edit columns"
              style={{ border: '1px solid #bbb', background: '#fff', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}
            >
              ✏️
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ textAlign: 'left', padding: '12px 12px', borderTopLeftRadius: 8 }}>S.No</th>
                  {section.columns.map((col) => (
                    <th key={col} style={{ textAlign: 'left', padding: '12px 12px' }}>{col}</th>
                  ))}
                  <th style={{ textAlign: 'left', padding: '12px 12px', borderTopRightRadius: 8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 ? '#eaf7fb' : '#fff' }}>
                    <td style={{ padding: '12px 12px', fontWeight: 700 }}>{idx + 1}</td>
                    {section.columns.map((col) => (
                      <td key={col} style={{ padding: '12px 12px' }}>
                        {editingIndex === idx ? (
                          <input
                            value={String(editedRow[col] ?? '')}
                            onChange={(e) => setEditedRow({ ...editedRow, [col]: e.target.value })}
                            style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 6 }}
                          />
                        ) : (
                          <span>{String(row[col] ?? '')}</span>
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
          <div style={{ background: '#fff8e1', border: '1px solid #f0e0a0', borderRadius: 8, padding: 16, marginTop: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Adding new row</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${section.columns.length}, minmax(140px, 1fr))`, gap: 12 }}>
              {section.columns.map((col) => (
                <input
                  key={col}
                  placeholder={col}
                  value={String(newRow[col] ?? '')}
                  onChange={(e) => setNewRow({ ...newRow, [col]: e.target.value })}
                  style={{ padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 15 }}
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
              Wedding Management / <span style={{ color: '#2196f3', fontWeight: 700 }}>{wedding?.weddingId || ''}</span> / Vendor Master Sheet
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 26, margin: '6px 0 16px 0' }}>Vendor master sheet table</h2>

            {/* Column inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))', gap: 16 }}>
              {columnsDraft.map((c, i) => (
                <input
                  key={i}
                  placeholder={`Column ${i + 1}`}
                  value={c}
                  onChange={(e) => {
                    const copy = [...columnsDraft];
                    copy[i] = e.target.value;
                    setColumnsDraft(copy);
                  }}
                  style={{ padding: '14px 16px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 16 }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button onClick={() => setColumnsDraft([...columnsDraft, ''])} style={{ background: '#2196f3', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px', cursor: 'pointer' }}>Add field</button>
              <button onClick={applyHeaderUpdate} disabled={saving} style={{ background: '#1abc5b', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px', cursor: 'pointer' }}>Update</button>
              <button onClick={() => setEditHeaderOpen(false)} style={{ background: '#fff', color: '#222', border: '1.5px solid #ccc', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '10px 28px', cursor: 'pointer' }}>Cancel</button>
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
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: '32px 36px',
  boxShadow: '0 4px 32px #0002',
  minWidth: 720,
};
