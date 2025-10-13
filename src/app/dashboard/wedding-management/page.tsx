'use client';

import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
// Removed unused Image import and added Ionicons to match main dashboard styling
import { IoChevronForward, IoTrashOutline, IoFunnelOutline, IoEyeOutline } from 'react-icons/io5';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import { AuthWrapper } from '@/hooks/useAdminAuth';

// Static demo data (will be replaced by API data later)
const STATIC_WEDDINGS = [
	{ _id: 'w1', weddingId: 'WD-1001', title: 'Ankit & Riya Palace Wedding', date: '2025-10-04', status: 'Planned' },
	{ _id: 'w2', weddingId: 'WD-1002', title: 'Karan & Meera Beach Ceremony', date: '2025-11-15', status: 'In Progress' },
	{ _id: 'w3', weddingId: 'WD-1003', title: 'Siddharth & Ayesha Royal Event', date: '2025-09-28', status: 'Completed' },
	{ _id: 'w4', weddingId: 'WD-1004', title: 'Rahul & Neha Mountain Wedding', date: '2025-12-09', status: 'On Hold' },
	{ _id: 'w5', weddingId: 'WD-1005', title: 'Vikram & Tara Destination Gala', date: '2026-01-21', status: 'Cancelled' },
	{ _id: 'w6', weddingId: 'WD-1006', title: 'Arjun & Priya Garden Wedding', date: '2025-10-18', status: 'Planned' },
	{ _id: 'w7', weddingId: 'WD-1007', title: 'Manav & Jaya Heritage Celebration', date: '2025-11-02', status: 'In Progress' },
	// Added more sample rows with wider status coverage
	{ _id: 'w8', weddingId: 'WD-1008', title: 'Ishaan & Kavya City Banquet', date: '2025-12-22', status: 'Draft' },
	{ _id: 'w9', weddingId: 'WD-1009', title: 'Rohit & Sneha Lakeside Rituals', date: '2025-12-30', status: 'Planned' },
	{ _id: 'w10', weddingId: 'WD-1010', title: 'Dev & Anita Vineyard Soirée', date: '2026-01-05', status: 'Delayed' },
	{ _id: 'w11', weddingId: 'WD-1011', title: 'Sameer & Pooja Hilltop Mehndi', date: '2025-11-11', status: 'On Hold' },
	{ _id: 'w12', weddingId: 'WD-1012', title: 'Harsh & Nidhi Sunset Beach Vows', date: '2025-10-29', status: 'In Progress' },
	{ _id: 'w13', weddingId: 'WD-1013', title: 'Aarav & Muskaan Desert Festival', date: '2026-02-14', status: 'Planned' },
	{ _id: 'w14', weddingId: 'WD-1014', title: 'Kabir & Radhika Luxury Cruise', date: '2026-03-02', status: 'Draft' },
	{ _id: 'w15', weddingId: 'WD-1015', title: 'Nakul & Esha Heritage Fort Events', date: '2025-12-01', status: 'In Progress' },
	{ _id: 'w16', weddingId: 'WD-1016', title: 'Yash & Tania Garden Brunch', date: '2025-10-07', status: 'Completed' },
	{ _id: 'w17', weddingId: 'WD-1017', title: 'Parth & Simran Lantern Night', date: '2026-01-18', status: 'Cancelled' },
	{ _id: 'w18', weddingId: 'WD-1018', title: 'Rajat & Sanika Royal Procession', date: '2025-11-27', status: 'Review' },
	{ _id: 'w19', weddingId: 'WD-1019', title: 'Tejas & Aditi Temple Blessings', date: '2025-10-25', status: 'Archived' },
	{ _id: 'w20', weddingId: 'WD-1020', title: 'Abhay & Kriti Forest Retreat', date: '2026-02-01', status: 'Planned' },
];

export default function WeddingManagementPage() {
	const router = useRouter();
	const pathname = usePathname();
	const [weddings, setWeddings] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleteModal, setDeleteModal] = useState<{ open: boolean; wedding?: any }>({ open: false });
	const [deleting, setDeleting] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	// Phone breakpoint for compact icon-only actions
	const [isPhone, setIsPhone] = useState(false);
	// Search text for client-side filtering
	const [searchText, setSearchText] = useState('');
	// Status filter state
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [filterOpen, setFilterOpen] = useState(false);
	const filterRef = useRef<HTMLDivElement | null>(null);

	// Track viewport for mobile-only drawer
	useEffect(() => {
		const check = () => setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);

	// Track phone width (≤576px) to swap View button with eye icon
	useEffect(() => {
		const mql = window.matchMedia('(max-width: 576px)');
		const onChange = () => setIsPhone(mql.matches);
		onChange();
		mql.addEventListener?.('change', onChange);
		// Safari fallback
		mql.addListener?.(onChange as any);
		return () => {
			mql.removeEventListener?.('change', onChange);
			mql.removeListener?.(onChange as any);
		};
	}, []);

	// Close drawer on route change
	useEffect(() => { setDrawerOpen(false); }, [pathname]);

	// Ensure drawer closes when switching to desktop/tablet
	useEffect(() => { if (!isMobile && drawerOpen) setDrawerOpen(false); }, [isMobile, drawerOpen]);

	// Lock body scroll when drawer open on mobile
	useEffect(() => {
		if (typeof document === 'undefined') return;
		if (isMobile && drawerOpen) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = '';
		return () => { document.body.style.overflow = ''; };
	}, [isMobile, drawerOpen]);

	// Close filter dropdown on outside click
	useEffect(() => {
		function onDocClick(e: MouseEvent) {
			if (!filterRef.current) return;
			if (!filterRef.current.contains(e.target as Node)) setFilterOpen(false);
		}
		if (filterOpen) document.addEventListener('mousedown', onDocClick);
		return () => document.removeEventListener('mousedown', onDocClick);
	}, [filterOpen]);

	const fetchWeddings = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/weddings');
			const data = await res.json();
			console.log('[WeddingList] GET /api/weddings ->', Array.isArray(data) ? data.map((w: any) => ({ _id: w._id, weddingId: w.weddingId, title: w.title })) : data);
			// Merge/replace with static sample data for now
			const merged = Array.isArray(data) && data.length > 0 ? [...data, ...STATIC_WEDDINGS] : [...STATIC_WEDDINGS];
			setWeddings(merged);
		} catch (err) {
			console.error('[WeddingList] Failed to fetch weddings:', err);
			setWeddings([...STATIC_WEDDINGS]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWeddings();
	}, []);

	const handleDelete = async () => {
		if (!deleteModal.wedding) return;
		setDeleting(true);
		try {
			console.log('[WeddingList] Deleting wedding _id:', deleteModal.wedding._id);
			await fetch(`/api/weddings/${deleteModal.wedding._id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
			});
			setDeleteModal({ open: false });
			fetchWeddings();
		} catch (err) {
			console.error('[WeddingList] Failed to delete wedding:', err);
			alert('Failed to delete wedding.');
		} finally {
			setDeleting(false);
		}
	};

	// Unique statuses derived from current weddings (dynamic)
	const uniqueStatuses = useMemo(() => {
		const set = new Set<string>();
		weddings.forEach(w => { if (w?.status) set.add(w.status); });
		return Array.from(set).sort();
	}, [weddings]);

	// Combined filter (status + search)
	const filteredWeddings = useMemo(() => {
		let list = weddings;
		if (statusFilter) list = list.filter(w => w.status === statusFilter);
		if (searchText.trim()) {
			const tokens = searchText.toLowerCase().split(/\s+/).filter(Boolean);
			list = list.filter((w: any) => {
				const hay = `${w?.weddingId ?? ''} ${w?.title ?? ''} ${w?.date ?? ''} ${w?.status ?? ''}`.toLowerCase();
				return tokens.every(t => hay.includes(t));
			});
		}
		return list;
	}, [weddings, searchText, statusFilter]);

	return (
		<AuthWrapper>
			<div style={{ minHeight: '100vh', background: 'white' }}>
				{deleteModal.open && (
					<div style={modalOverlayStyle}>
						<div style={modalStyle}>
							{/* Header */}
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0 }}>
								<span style={{ fontSize: 28, color: '#e53935', marginBottom: 6, lineHeight: 1 }}>
									<IoTrashOutline size={24} />
								</span>
								<div style={{ fontWeight: 600, fontSize: 16, color: '#e53935', marginBottom: 0, textAlign: 'center' }}>
									Delete {deleteModal.wedding?.title} <span style={{ color: '#2196f3', marginLeft: 6 }}>({deleteModal.wedding?._id})</span>
								</div>
							</div>
							{/* Body */}
							<div style={{ fontWeight: 500, fontSize: 13, margin: '12px 0 6px 0', color: '#222', textAlign: 'center' }}>
								Are you sure?
							</div>
							{/* Footer */}
							<div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 12 }}>
								<button onClick={handleDelete} disabled={deleting} style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{deleting ? 'Deleting...' : 'Yes, Delete'}</button>
								<button onClick={() => setDeleteModal({ open: false })} style={{ background: '#fff', color: '#222', border: '1.5px solid #ccc', borderRadius: 8, padding: '7px 14px', fontWeight: 500, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
							</div>
						</div>
					</div>
				)}

				{/* Header and Sidebar (both fixed by their own components) */}
				<DashboardHeader onMenuClick={() => { if (isMobile) setDrawerOpen(true); }} />
				<DashboardSidebar open={isMobile && drawerOpen} onClose={() => isMobile && setDrawerOpen(false)} />

				{/* Main Content */}
				<main
					className="container-fluid"
					style={{
						marginLeft: isMobile ? 0 : 'var(--sidebar-w)',
						marginTop: 'var(--header-h)',
						flex: 1,
						background: 'white',
						overflowX: 'hidden',
						width: '-webkit-fill-available',
					}}
					aria-hidden={isMobile && drawerOpen}
				>
					{/* Header */}
					<div className="d-flex align-items-center justify-content-between mb-3 gap-2 mt-2 flex-wrap">
						<h1 className="m-0" style={{ fontWeight: 600, fontSize: '1.2rem' }}>Wedding Management</h1>
					</div>

					{/* Cards - match main dashboard sizing and arrow placement */}
					<div className="row g-3 mb-4">
						<div className="col-12 col-sm-4 col-md-4 col-lg-4">
							<div style={{ background: '#d6effa', padding: '18px 20px' }}>
								<div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>106</div>
								<div style={{ color: '#222', fontWeight: 500, fontSize: 15, marginTop: 4, display: 'flex', alignItems: 'center' }}>
									<span>Weddings</span>
									<IoChevronForward size={19} style={{ color: '#3698D9', marginLeft: '0.3rem'}} />
								</div>
							</div>
						</div>
						<div className="col-12 col-sm-4 col-md-4 col-lg-4">
							<div style={{ background: '#fdf5d5', padding: '18px 20px' }}>
								<div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>23</div>
								<div style={{ color: '#222', fontWeight: 500, fontSize: 15, marginTop: 4, display: 'flex', alignItems: 'center' }}>
									<span>Upcoming</span>
									<IoChevronForward size={19} style={{ color: '#3698D9', marginLeft: '0.3rem' }} />
								</div>
							</div>
						</div>
						<div className="col-12 col-sm-4 col-md-4 col-lg-4">
							<div style={{ background: '#fbe7d7', padding: '18px 20px' }}>
								<div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>2.5 Lac</div>
								<div style={{ color: '#222', fontWeight: 500, fontSize: 15, marginTop: 4, display: 'flex', alignItems: 'center' }}>
									<span>Guest</span>
									<IoChevronForward size={19} style={{ color: '#3698D9', marginLeft: '0.3rem' }} />
								</div>
							</div>
						</div>
					</div>

					{/* Wedding List Section */}
					<div className='p-3 p-md-4'>
						<div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
							<h2 className="m-0" style={{ fontWeight: 600, fontSize: 16 }}>Wedding List</h2>
							<div className="d-flex gap-2 flex-wrap" ref={filterRef} style={{ position: 'relative' }}>
								<button
									type="button"
									className="btn btn-outline-dark btn-sm"
									style={{ fontSize: '13px', fontWeight: 400, padding: '1px 20px', display: 'flex', alignItems: 'center' }}
									onClick={() => setFilterOpen(o => !o)}
									aria-haspopup="listbox"
									aria-expanded={filterOpen}
								>
									<span style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 6, display: 'inline-flex' }}>
										<IoFunnelOutline />
									</span>
									{statusFilter ? `Status: ${statusFilter}` : 'Filter'}
								</button>
								{filterOpen && (
									<div className="filter-dropdown shadow" role="listbox" aria-label="Filter by status">
										<div
											className={`filter-option ${statusFilter === '' ? 'active' : ''}`}
											onClick={() => { setStatusFilter(''); setFilterOpen(false); }}
											role="option"
											aria-selected={statusFilter === ''}
										>All Statuses</div>
										{uniqueStatuses.map(st => (
											<div
												key={st}
												className={`filter-option ${statusFilter === st ? 'active' : ''}`}
												onClick={() => { setStatusFilter(st); setFilterOpen(false); }}
												role="option"
												aria-selected={statusFilter === st}
											>{st}</div>
										))}
										{uniqueStatuses.length === 0 && <div className="filter-empty">No statuses</div>}
									</div>
								)}
								<button className="btn btn-success create-btn" onClick={() => router.push('/dashboard/wedding-management/create')} style={{
									fontSize: '13px',
									fontWeight: 400,
									padding: '1px 20px',
								}}>Create</button>
							</div>
						</div>
						<div className="mb-3">
							<input
								type="text"
								placeholder="🔎︎   Search any Wedding"
								className="form-control"
								style={{ fontSize: 12, padding: '10px 12px' }}
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								aria-label="Search weddings"
							/>
						</div>
						<div className="table-responsive">
							<table className="table align-middle mb-0" style={{ fontSize: 14 }}>
								<thead>
									<tr>
										<th style={{ background: '#EBE9E9', fontSize: '14px', width:'20%' }}>Id</th>
										<th style={{ background: '#EBE9E9', fontSize: '14px', width:'15%' }}>Title</th>
										<th style={{ background: '#EBE9E9', fontSize: '14px', width:'15%' }}>Wedding Date</th>
										<th style={{ background: '#EBE9E9', fontSize: '14px', width:'15%' }}>Status</th>
										<th style={{ background: '#EBE9E9', fontSize: '14px', width:'15%' }}>Action</th>
										<th style={{ background: '#EBE9E9', fontSize: '14px', width:'15%' }}></th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
									) : filteredWeddings.length === 0 ? (
										<tr><td colSpan={6} className="text-center py-4">No matching weddings found.</td></tr>
									) : (
										filteredWeddings.map((wedding, i) => (
											<tr key={wedding._id || i}>
												<td className="py-3" style={{ color: '#2196f3', fontWeight: 500, cursor: 'pointer', fontSize: '12px' }}>{wedding.weddingId}</td>
												<td className="py-3" style={{ fontSize: '12px' }}>{wedding.title}</td>
												<td className="py-3" style={{ fontSize: '12px' }}>{wedding.date}</td>
												<td className="py-3" style={{ fontSize: '12px' }}>{wedding.status}</td>
												<td className="py-3">
													<div className="action-cell">
														{isPhone ? (
															<button
																type="button"
																className="icon-btn view-icon-btn"
																aria-label="View details"
																onClick={() => router.push(`/dashboard/wedding-management/${wedding._id}/info`)}
															>
																<IoEyeOutline size={18} />
															</button>
														) : (
															<button
																className="btn btn-sm view-btn"
																style={{ fontSize: '13px' }}
																onClick={() => router.push(`/dashboard/wedding-management/${wedding._id}/info`)}
															>
																View Details
															</button>
														)}
													</div>
												</td>
												<td className='py-3'>
													<button
														type="button"
														className="icon-btn delete-btn"
														aria-label="Delete wedding"
														onClick={() => setDeleteModal({ open: true, wedding })}
													>
														<IoTrashOutline size={18} />
													</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>
				</main>
				<style jsx>{`
					.filter-dropdown { position: absolute; top: 115%; left: 0; background: #fff; border: 1px solid #e2e2e2; border-radius: 10px; padding: 6px 0; min-width: 180px; z-index: 50; animation: fadeIn .12s ease; }
					.filter-option { padding: 6px 14px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; color: #333; transition: background .15s, color .15s; }
					.filter-option:hover { background: #f1f9ff; color: #3698db; }
					.filter-option.active { background: #3698db; color: #fff; font-weight: 500; font-size: 12px; }
					.filter-empty { padding: 8px 14px; font-size: 12px; color: #888; }
					.action-cell { display: inline-flex; align-items: center; gap: 10px; }
					.icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0; border: 1px solid transparent; border-radius: 6px; background: transparent; color: #e57373; cursor: pointer; transition: all .2s ease; }
					.icon-btn:hover { background: #fdecec; color: #d9534f; border-color: #f5c6c6; }
					.icon-btn:focus-visible { outline: 2px solid rgba(217,83,79,.45); outline-offset: 2px; }
					/* Eye icon (View) on phones: black */
					.view-icon-btn { color: #000; }
					.view-icon-btn:hover { background: #f2f2f2; color: #000; border-color: #d0d0d0; }
					.create-btn { background: #2BB96B; border-color: #2BB96B; transition: all .2s ease; }
					.create-btn:hover { background: #23a95f; border-color: #23a95f; box-shadow: 0 4px 12px rgba(43,185,107,.35); transform: translateY(-1px); }
					.create-btn:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(43,185,107,.25); }
					.create-btn:focus-visible { outline: 2px solid #1e8c4a; outline-offset: 2px; }
					/* View Details button: invert colors on hover */
					.view-btn { background: #fff; color: #3698D9; border: var(--bs-border-width) solid #3698D9; transition: all .2s ease; }
					.view-btn:hover { background: #3698D9; color: #fff; border-color: #3698D9; }
					.view-btn:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(54,152,217,.25); }
					.view-btn:focus-visible { outline: 2px solid rgba(54,152,217,.5); outline-offset: 2px; }
					/* Keep form control border unchanged on focus */
					.form-control:focus { border: var(--bs-border-width) solid var(--bs-border-color) !important; box-shadow: none; }
					@media (max-width: 1024px) {
					  main { margin-left: 0; padding: 12px 12px 28px 12px; }
					}
					@media (max-width: 576px) {
					  .action-cell { flex-direction: column; align-items: flex-start; gap: 6px; }
					}
					@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px);} to { opacity: 1; transform: translateY(0);} }
				`}</style>
			</div>
		</AuthWrapper>
	);
}

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
	padding: 12,
	animation: 'fadeIn 0.25s',
};

const modalStyle = {
	background: '#fff',
	borderRadius: 12,
	padding: '12px',
	boxShadow: '0 4px 24px #0002',
	textAlign: 'center' as const,
	minWidth: 'min(20rem, 92vw)',
	animation: 'popIn 0.25s',
};
