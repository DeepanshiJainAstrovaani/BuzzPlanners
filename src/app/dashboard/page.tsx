/* eslint-disable @typescript-eslint/no-unused-vars  */

'use client';

import { usePathname } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useState, useEffect } from 'react';
import { IoChevronForward, IoAirplaneOutline, IoBusinessOutline, IoBagHandleOutline, IoTrashOutline } from 'react-icons/io5';
import { AuthWrapper } from '@/hooks/useAdminAuth';

export default function DashboardPage() {
	const pathname = usePathname();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// Track viewport to enable drawer only on mobile (<=1024px)
	useEffect(() => {
		const check = () => setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
		check();
		window.addEventListener('resize', check);
		return () => window.removeEventListener('resize', check);
	}, []);

	// Close drawer on route change
	useEffect(() => {
		setDrawerOpen(false);
	}, [pathname]);

	// Ensure drawer is closed if switching to desktop/tablet
	useEffect(() => {
		if (!isMobile && drawerOpen) setDrawerOpen(false);
	}, [isMobile, drawerOpen]);

	// Lock body scroll when drawer is open on mobile
	useEffect(() => {
		if (typeof document === 'undefined') return;
		if (isMobile && drawerOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isMobile, drawerOpen]);

	return (
		<AuthWrapper>
		<div style={{ background: 'white' }}>
			{/* Header (fixed within component) */}
			<DashboardHeader onMenuClick={() => { if (isMobile) setDrawerOpen(true); }} />

			{/* Sidebar (fixed within component) */}
			<DashboardSidebar open={isMobile && drawerOpen} onClose={() => isMobile && setDrawerOpen(false)} />

			{/* Main Content */}
			<main
				className="container-fluid"
				style={{
					marginLeft: isMobile ? 0 : 'var(--sidebar-w)',
					marginTop: 'var(--header-h)',
					flex: 1,
					overflowX: 'hidden',
					width: '-webkit-fill-available',
				}}
				aria-hidden={isMobile && drawerOpen}
			>
				{/* Dashboard Cards */}
				<div className="row g-3 mb-4">
					<div className="col-12 col-sm-4 col-md-4 col-lg-4">
						<div style={{ background: '#d6effa', padding: '18px 20px' }}>
							<div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>6</div>
							<div style={{ color: '#222', fontWeight: 500, fontSize: 15, marginTop: 4, display: 'flex', alignItems: 'center' }}>
								<span>Vendors</span>
								<IoChevronForward size={19} />
							</div>
						</div>
					</div>
					<div className="col-12 col-sm-4 col-md-4 col-lg-4">
						<div style={{ background: '#fdf5d5', padding: '18px 20px' }}>
							<div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>982</div>
							<div style={{ color: '#222', fontWeight: 500, fontSize: 15, marginTop: 4, display: 'flex', alignItems: 'center' }}>
								<span>Flight Bookings</span>
								<IoChevronForward size={19} />
							</div>
						</div>
					</div>
					<div className="col-12 col-sm-4 col-md-4 col-lg-4">
						<div style={{ background: '#fbe7d7', padding: '18px 20px' }}>
							<div style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>6</div>
							<div style={{ color: '#222', fontWeight: 500, fontSize: 15, marginTop: 4, display: 'flex', alignItems: 'center' }}>
								<span>Hotel Bookings</span>
								<IoChevronForward size={19} />
							</div>
						</div>
					</div>
				</div>
				{/* New Leads Section */}
				<div className="p-3 p-md-4">
					<div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
						<h4 className="m-0" style={{ fontWeight: 600, fontSize: 20 }}>New Leads</h4>
						<div className="d-flex gap-2 flex-wrap">
							<button className="btn btn-light d-inline-flex align-items-center gap-2 px-3 py-2 rounded-5" style={{ background: '#F5F5F5' }}>
								<IoAirplaneOutline size={18} /> <span className="small">Flights</span>
							</button>
							<button className="btn btn-light d-inline-flex align-items-center gap-2 px-3 py-2 rounded-5" style={{ background: '#fdf5d5' }}>
								<IoBusinessOutline size={18} /> <span className="small">Hotels</span>
							</button>
							<button className="btn btn-light d-inline-flex align-items-center gap-2 px-3 py-2 rounded-5" style={{ background: '#F5F5F5' }}>
								<IoBagHandleOutline size={18} /> <span className="small">Trip</span>
							</button>
						</div>
					</div>
					<div className="table-responsive">
						<table className="table align-middle mb-0" style={{ fontSize: 14 }}>
							<thead>
								<tr>
									<th style={{ background: '#EBE9E9', fontSize: '15px', width:'20%' }}>Name</th>
									<th style={{ background: '#EBE9E9', fontSize: '15px', width:'15%' }}>Type</th>
									<th style={{ background: '#EBE9E9', fontSize: '15px', width:'15%' }}>People</th>
									<th style={{ background: '#EBE9E9', fontSize: '15px', width:'15%' }}>Date</th>
									<th style={{ background: '#EBE9E9', fontSize: '15px', width:'15%' }}>Action</th>
									<th style={{ background: '#EBE9E9', fontSize: '15px', width:'15%' }}></th>
								</tr>
							</thead>
							<tbody>
								{[1, 2, 3, 4].map((_, i) => (
									<tr key={i}>
										<td className="py-3" style={{ fontSize: '14px' }}>Rajesh Shah</td>
										<td className="py-3" style={{ fontSize: '14px' }}>Hotel</td>
										<td className="py-3" style={{ fontSize: '14px' }}>4 People</td>
										<td className="py-3" style={{ fontSize: '14px' }}>04 Sep 2025</td>
										<td className="py-3" style={{ fontSize: '14px' }}>
											<button className="btn btn-outline-primary btn-sm me-2 view-details-btn px-3" style={{ color: '#3698D9', borderColor: '#3698D9', fontSize: '13px' }}>View Details</button>
										</td>
										<td>
											<span style={{ color: '#e57373', cursor: 'pointer', verticalAlign: 'middle', marginLeft: 8, display: 'flex', alignItems: 'center' }}>
												<IoTrashOutline size={20} />
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</main>
			<style jsx>{`
				@media (max-width: 1024px) {
					main { margin-left: 0; padding: 12px 12px 28px 12px; }
				}
				.view-details-btn:hover { color: #ffffff !important; border-color: #3698D9 !important; background-color: #3698D9 !important; }
			`}</style>
		</div>
		</AuthWrapper>
	);
}
