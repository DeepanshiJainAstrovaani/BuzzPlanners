'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import './datepicker-fix.css';
import { IconButton, Chip, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';

type FormFields = {
  weddingId: string;
  title: string;
  date: string;
  venue: string;
  groomContact: string;
  groomMobile: string;
  brideContact: string;
  brideMobile: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};

type ErrorFields = Partial<Record<keyof FormFields, string>>;

export default function CreateWeddingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Form state
  const [form, setForm] = useState<FormFields>({
    weddingId: '',
    title: '',
    date: '',
    venue: '',
    groomContact: '',
    groomMobile: '',
    brideContact: '',
    brideMobile: '',
    status: 'Upcoming',
  });
  const [errors, setErrors] = useState<ErrorFields>({});
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Wedding ID state
  const [weddingId, setWeddingId] = useState<string>(() => {
    // Generate WED + 3 random digits
    return 'WED' + Math.floor(100 + Math.random() * 900);
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [existingSections, setExistingSections] = useState<any[]>([]);

  // On mount, detect edit mode and fetch existing wedding
  useEffect(() => {
    const isEdit = searchParams?.get('edit') === '1';
    const id = searchParams?.get('id');
    if (isEdit && id) {
      setIsEditMode(true);
      setEditingId(id);
      (async () => {
        try {
          const res = await fetch(`/api/weddings/${id}`, { cache: 'no-store' });
          if (!res.ok) throw new Error('Failed to fetch wedding');
          const data = await res.json();
          console.log('[EditWedding] Loaded wedding:', { _id: data?._id, weddingId: data?.weddingId, title: data?.title });
          // Prefill form fields
          setWeddingId(data.weddingId || weddingId);
          setForm({
            weddingId: data.weddingId || '',
            title: data.title || '',
            date: data.date || '',
            venue: data.venue || '',
            groomContact: data.contactPersonGroomSide || '',
            groomMobile: data.mobileGroomSide || '',
            brideContact: data.contactPersonBrideSide || '',
            brideMobile: data.mobileBrideSide || '',
            status: (data.status as FormFields['status']) || 'Upcoming',
          });
          // Parse date for DatePicker
          try {
            const parts = (data.date || '').split('/');
            let d: Date | null = null;
            if (parts.length === 3) d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            else if (data.date) d = new Date(data.date);
            if (d && !isNaN(d.getTime())) setDateValue(d); else setDateValue(null);
          } catch {}
          // Prefill chips from sections
          const secs: any[] = Array.isArray(data.sections) ? data.sections : [];
          setExistingSections(secs);
          const labels: string[] = secs.map((s: any) => s?.label).filter((x: any): x is string => typeof x === 'string');
          const uniqueLabels: string[] = Array.from(new Set<string>(labels));
          const ensurePermanent: string[] = uniqueLabels.includes(permanentChip) ? uniqueLabels : [permanentChip, ...uniqueLabels];
          setChips(ensurePermanent);
          // Adjust suggestions to exclude existing chips
          const updatedSuggestions = initialSuggestions.filter(s => !ensurePermanent.includes(s));
          setSuggestions(updatedSuggestions);
        } catch (e) {
          console.error('[EditWedding] Error loading wedding:', e);
        }
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Table chips state
  const permanentChip = 'Vendor Master Sheet';
  const initialChips = [
    permanentChip,
    'Bride Side',
    'Groom Side',
    'Makeup Artist',
    'Performance Lineups',
    'Bride Hotel',
  ];
  const initialSuggestions = [
    'Decor',
    'Groom Guest',
    'Groom Hotel',
  ];
  const [chips, setChips] = useState<string[]>(initialChips);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const [addMode, setAddMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [chipInput, setChipInput] = useState('');

  const chipEditRef = useRef<HTMLSpanElement>(null);
  const chipAddRef = useRef<HTMLSpanElement>(null);
  const editInputRef = useRef<HTMLDivElement>(null);
  const addInputRef = useRef<HTMLDivElement>(null);

  // Validation helpers
  const isPhoneValid = (num: string) => /^\d{10}$/.test(num);

  const validate = () => {
    const newErrors: ErrorFields = {};
    if (!form.title) newErrors.title = 'Wedding Title is required';
    if (!form.date) newErrors.date = 'Wedding Date is required';
    if (!form.venue) newErrors.venue = 'Venue is required';
    if (!form.groomContact) newErrors.groomContact = 'Contact Person (Groom side) is required';
    if (!form.groomMobile) newErrors.groomMobile = 'Mobile Number (Groom side) is required';
    else if (!isPhoneValid(form.groomMobile)) newErrors.groomMobile = 'Enter a valid 10-digit mobile number';
    if (!form.brideContact) newErrors.brideContact = 'Contact Person (Bride side) is required';
    if (!form.brideMobile) newErrors.brideMobile = 'Mobile Number (Bride side) is required';
    else if (!isPhoneValid(form.brideMobile)) newErrors.brideMobile = 'Enter a valid 10-digit mobile number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value } as FormFields);
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      // Build sections
      let sections;
      if (isEditMode) {
        // Preserve existing sections where labels still exist; create defaults for new chips
        const labelToSection = new Map<string, any>((existingSections || []).map((s: any) => [s.label, s]));
        sections = chips.map((chip) => {
          const existing = labelToSection.get(chip);
          if (existing) return existing; // keep as-is
          if (chip === permanentChip) {
            return {
              key: 'vendorMasterSheet',
              label: chip,
              type: 'table',
              columns: ["Item", "Status", "Advance", "Cost", "Pending", "Vendor", "Vendor Contact"],
              rows: [],
            };
          }
          return {
            key: chip.replace(/\s+/g, '').toLowerCase(),
            label: chip,
            type: 'table',
            columns: ["Name", "Details", "Notes"],
            rows: [],
          };
        });
      } else {
        sections = chips.map((chip) => {
          if (chip === permanentChip) {
            return {
              key: 'vendorMasterSheet',
              label: chip,
              type: 'table',
              columns: ["Item", "Status", "Advance", "Cost", "Pending", "Vendor", "Vendor Contact"],
              rows: [],
            };
          }
          return {
            key: chip.replace(/\s+/g, '').toLowerCase(),
            label: chip,
            type: 'table',
            columns: ["Name", "Details", "Notes"],
            rows: [],
          };
        });
      }
      const payload = {
        weddingId: weddingId,
        title: form.title,
        date: form.date,
        venue: form.venue,
        contactPersonGroomSide: form.groomContact,
        contactPersonBrideSide: form.brideContact,
        mobileGroomSide: form.groomMobile,
        mobileBrideSide: form.brideMobile,
        status: isEditMode ? (form.status || 'Upcoming') : 'Upcoming',
        sections,
      } as any;
      try {
        console.log(isEditMode ? '[EditWedding] Submitting update:' : '[CreateWedding] Submitting payload:', payload);
        const res = await fetch(isEditMode && editingId ? `/api/weddings/${editingId}` : '/api/weddings', {
          method: isEditMode ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => null);
        if (res.ok) {
          console.log(isEditMode ? '[EditWedding] Updated wedding response:' : '[CreateWedding] Created wedding response:', data);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            if (data?.weddingId) setWeddingId(data.weddingId);
            router.push('/dashboard/wedding-management');
          }, 1500);
        } else {
          console.error(isEditMode ? '[EditWedding] Failed response:' : '[CreateWedding] Failed response:', data);
          alert((isEditMode ? 'Failed to update wedding: ' : 'Failed to create wedding: ') + (data?.error || 'Unknown error'));
        }
      } catch (err) {
        console.error(isEditMode ? '[EditWedding] Network/Unexpected error:' : '[CreateWedding] Network/Unexpected error:', err);
        alert((isEditMode ? 'Failed to update wedding: ' : 'Failed to create wedding: ') + err);
      }
    }
  };

  // Add new chip
  const handleAddChip = () => {
    if (chipInput.trim() && !chips.includes(chipInput.trim()) && !suggestions.includes(chipInput.trim())) {
      setChips([...chips, chipInput.trim()]);
      setChipInput('');
      setAddMode(false);
    }
  };
  // Remove chip
  const handleDeleteChip = (chip: string) => {
    if (chip === permanentChip) return;
    setChips(chips.filter(c => c !== chip));
    if (!initialSuggestions.includes(chip)) setSuggestions([...suggestions, chip]);
  };
  // Edit chip
  const handleEditChip = (index: number) => {
    // Prevent opening edit if add mode is open
    if (addMode) return;
    setEditIndex(index);
    setChipInput(chips[index]);
  };
  const handleSaveEdit = () => {
    if (editIndex === null) return;
    const newChip = chipInput.trim();
    if (!newChip || chips.includes(newChip)) return;
    const updated = [...chips];
    updated[editIndex] = newChip;
    setChips(updated);
    setEditIndex(null);
    setChipInput('');
  };
  // Click chip to edit
  const handleChipClick = (chip: string, idx: number) => {
    if (chip === permanentChip) return;
    // Prevent opening edit if add mode is open
    if (addMode) return;
    handleEditChip(idx);
  };
  // Add suggestion chip
  const handleAddSuggestion = (chip: string) => {
    // Prevent adding suggestion if edit or add mode is open
    if (addMode || editIndex !== null) return;
    setChips([...chips, chip]);
    setSuggestions(suggestions.filter(c => c !== chip));
  };

  // Outside click logic for edit and add modes
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (editIndex !== null && editInputRef.current && !editInputRef.current.contains(event.target as Node)) {
        setEditIndex(null);
        setChipInput('');
      }
      if (addMode && addInputRef.current && !addInputRef.current.contains(event.target as Node)) {
        setAddMode(false);
        setChipInput('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editIndex, addMode]);

  return (
    <div style={{ minHeight: '100vh', background: '#f7f7f7' }}>
      {showSuccess && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle} className="modal-animate">
            <div style={{ fontSize: 48, color: isEditMode ? '#2196f3' : '#1abc5b', marginBottom: 16 }}>{isEditMode ? '✏️' : '✅️'}</div>
            <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>{isEditMode ? 'Wedding updated successfully!' : 'Wedding created successfully!'}</div>
            <div style={{ color: '#666', fontSize: 16 }}>Redirecting to dashboard...</div>
          </div>
        </div>
      )}
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
        <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #0001', padding: 40 }}>
          {/* Breadcrumb */}
          <div style={{ color: '#1abc5b', fontWeight: 500, fontSize: 18, marginBottom: 16 }}>
            Dashboard / Wedding Management
          </div>
          {/* Title Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h1 style={{ fontWeight: 700, fontSize: '2.2rem', margin: 0 }}>{isEditMode ? 'Edit wedding' : 'Create new wedding'}</h1>
            <span style={{ color: '#2196f3', fontWeight: 700, fontSize: 22 }}>Wedding Id: {weddingId}</span>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className='row col-md-12' style={{ display: 'flex', marginBottom: 24 }}>
              <div className='col-md-4 mb-4'>
                <input name="title" type="text" placeholder="Wedding Title" style={inputStyle} value={form.title} onChange={handleChange} />
                {errors.title && <div style={errorStyle}>{errors.title}</div>}
              </div>
              <div className='col-md-4 mb-4'>
                <DatePicker
                  selected={dateValue}
                  onChange={(date: Date | null) => {
                    setDateValue(date);
                    setForm({ ...form, date: date ? date.toLocaleDateString() : '' });
                    setErrors({ ...errors, date: undefined });
                  }}
                  placeholderText="Wedding Date"
                  customInput={<input style={{ ...inputStyle, width: '100%' }} />}
                  dateFormat="dd/MM/yyyy"
                  autoComplete="off"
                />
                {errors.date && <div style={errorStyle}>{errors.date}</div>}
              </div>
              <div className='col-md-4 mb-4'>
                <input name="venue" type="text" placeholder="Venue" style={inputStyle} value={form.venue} onChange={handleChange} />
                {errors.venue && <div style={errorStyle}>{errors.venue}</div>}
              </div>
            <div className='col-md-4 mb-4'>
                <input name="groomContact" type="text" placeholder="Contact Person (Groom side)" style={inputStyle} value={form.groomContact} onChange={handleChange} />
                {errors.groomContact && <div style={errorStyle}>{errors.groomContact}</div>}
              </div>
              <div className='col-md-4 mb-4'>
                <input name="groomMobile" type="text" placeholder="Mobile Number (Groom side)" style={inputStyle} value={form.groomMobile} onChange={handleChange} maxLength={10} />
                {errors.groomMobile && <div style={errorStyle}>{errors.groomMobile}</div>}
              </div>
              <div className='col-md-4 mb-4'>
                <input name="brideContact" type="text" placeholder="Contact Person (Bride side)" style={inputStyle} value={form.brideContact} onChange={handleChange} />
                {errors.brideContact && <div style={errorStyle}>{errors.brideContact}</div>}
              </div>
            <div className='col-md-4 mb-4'>
                <input name="brideMobile" type="text" placeholder="Mobile Number (Bride side)" style={inputStyle} value={form.brideMobile} onChange={handleChange} maxLength={10} />
                {errors.brideMobile && <div style={errorStyle}>{errors.brideMobile}</div>}
              </div>
            </div>
            {/* Add tables section */}
            <div style={{ background: '#eaf7fb', borderRadius: 12, padding: 24, marginBottom: 32 }}>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Add tables to this wedding</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', minHeight: 60 }}>
                {chips.map((chip, idx) => (
                  editIndex === idx ? (
                    <span key={chip} ref={editInputRef}>
                      <TextField size="small" value={chipInput} onChange={e => setChipInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(); }}
                        autoFocus
                        style={{ background: '#fffbe7', borderRadius: 2, minWidth: 120 }}
                        inputProps={{ maxLength: 32 }}
                      />
                      <IconButton onClick={handleSaveEdit} size="small" color="success"><CheckIcon /></IconButton>
                    </span>
                  ) : (
                    <Chip
                      key={chip}
                      label={chip}
                      style={chip === permanentChip ? { background: '#fdf5d5', fontWeight: 300, fontSize: 17, marginRight: 0, borderRadius: 2, padding: '1.5rem' } : { background: '#fdf5d5', fontWeight: 300, fontSize: 17, borderRadius: 2, padding: '1.5rem' }}
                      onClick={() => handleChipClick(chip, idx)}
                      onDelete={chip === permanentChip ? undefined : () => handleDeleteChip(chip)}
                      deleteIcon={chip === permanentChip ? undefined : <CloseIcon />}
                      clickable={chip !== permanentChip && !addMode && editIndex === null}
                    />
                  )
                ))}
                {addMode ? (
                  <span ref={addInputRef}>
                    <TextField size="small" value={chipInput} onChange={e => setChipInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddChip(); }}
                      autoFocus
                      style={{ background: '#fffbe7', borderRadius: 2, minWidth: 120 }}
                      inputProps={{ maxLength: 32 }}
                    />
                    <IconButton onClick={handleAddChip} size="small" color="success"><CheckIcon /></IconButton>
                  </span>
                ) : null}
                <IconButton onClick={() => { if (!addMode && editIndex === null) { setAddMode(true); setChipInput(''); } }} size="small" color="primary" style={{ background: '#2196f3', color: '#fff', borderRadius: 8 }}>
                  <AddIcon />
                </IconButton>
              </div>
              {/* Suggestion chips on next line */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: '5rem' }}>
                <span style={{ fontWeight: 600, color: '#666' }}>Suggestions: </span>
                {suggestions.map(chip => (
                  <Chip
                    key={chip}
                    label={chip}
                    variant="outlined"
                    style={{ border: '1px solid #2196f3', color: '#2196f3', fontWeight: 400, fontSize: 17, background: '#fff', borderRadius: 2, padding: '1.5rem'}}
                    onClick={() => handleAddSuggestion(chip)}
                    clickable={!addMode && editIndex === null}
                  />
                ))}
              </div>
            </div>
            {/* Submit Button */}
            <button type="submit" style={createBtnStyle}>{isEditMode ? 'Update' : 'Create'}</button>
          </form>
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  padding: '18px',
  borderRadius: 8,
  border: '1.5px solid #e0e0e0',
  fontSize: 18,
  background: '#fafafa',
  fontWeight: 500,
  marginBottom: 0,
  outline: 'none',
  transition: 'border 0.2s',
  width: '100%',
};

const tagStyle = {
  background: '#fdf5d5',
  color: '#222',
  borderRadius: 8,
  padding: '10px 22px',
  fontWeight: 600,
  fontSize: 17,
  display: 'inline-block',
  border: 'none',
};

const tagStyleBlue = {
  background: '#fff',
  color: '#2196f3',
  border: '2px solid #2196f3',
  borderRadius: 8,
  padding: '10px 22px',
  fontWeight: 600,
  fontSize: 17,
  display: 'inline-block',
};

const addNewBtnStyle = {
  background: '#2196f3',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 28px',
  fontWeight: 700,
  fontSize: 17,
  cursor: 'pointer',
  marginLeft: 8,
  boxShadow: '0 2px 8px #2196f322',
  transition: 'background 0.2s',
};

const createBtnStyle = {
  background: '#1abc5b',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 22,
  padding: '16px 0',
  marginTop: 16,
  cursor: 'pointer',
  display: 'block',
  width: '100%',
  boxShadow: '0 2px 8px #1abc5b22',
  letterSpacing: 1,
};

const errorStyle = {
  color: '#e53935',
  fontWeight: 600,
  fontSize: 14,
  marginTop: 4,
  marginLeft: 2,
};

const modalOverlayStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fadeIn 0.3s',
};

const modalStyle = {
  background: '#fff',
  borderRadius: 16,
  padding: '40px 48px',
  boxShadow: '0 4px 32px #0002',
  textAlign: 'center' as const,
  minWidth: 320,
  animation: 'popIn 0.3s',
};
