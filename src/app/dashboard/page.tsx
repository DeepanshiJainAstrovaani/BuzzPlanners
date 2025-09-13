'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
	{ label: 'Wedding Management', path: '/dashboard/wedding-management' },
	{ label: 'Booking Management', path: '/dashboard/booking-management' },
	{ label: 'Itinerary Builder', path: '/dashboard/itinerary-builder' },
	{ label: 'Voucher Management', path: '/dashboard/voucher-management' },
	{ label: 'Hotels Management', path: '/dashboard/hotels-management' },
	{ label: 'Vendor Management', path: '/dashboard/vendor-management' },
	{ label: 'Customized Package', path: '/dashboard/customized-package' },
	{ label: 'Site Management', path: '/dashboard/site-management' },
];

export default function DashboardPage() {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<div style={{ minHeight: '100vh', background: '#f7f7f7' }}>
			{/* Top Header */}
			<header
				style={{
					width: '100%',
					background: '#222222',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0.8rem 2rem',
					position: 'fixed',
					top: 0,
					left: 0,
					zIndex: 100,
					borderBottom: '1px solid white',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
					<Image
						src="/buzzplannersLogo.png"
						alt="Buzz Planners"
						width={120}
						height={60}
					/>
				</div>
				<button
					style={{
						background: 'none',
						border: 'none',
						color: '#e57373',
						fontSize: '1.1rem',
						fontWeight: 600,
						cursor: 'pointer',
						transition: 'color 0.2s',
					}}
					onClick={() => router.push('/login')}
				>
					Logout
				</button>
			</header>

			{/* Sidebar */}
			<aside
				style={{
					width: 240,
					background: '#222222',
					color: '#fff',
					height: '100vh',
					padding: '24px 0',
					position: 'fixed',
					left: 0,
					top: 72,
					display: 'flex',
					flexDirection: 'column',
					zIndex: 99,
				}}
			>
				<div
					style={{
						fontWeight: 'bold',
						fontSize: '1.1rem',
						marginBottom: 32,
						textAlign: 'left',
						paddingLeft: 32,
						letterSpacing: 0.5,
					}}
				>
					Your Dashboard
				</div>
				<nav>
					<ul style={{ listStyle: 'none', padding: 0 }}>
						{menuItems.map((item) => (
							<li
								key={item.path}
								style={{
									margin: '8px 0',
									borderBottom: '1px solid white',
								}}
							>
								<Link
									href={item.path}
									style={{
										color:
											pathname === item.path
												? '#ffb300'
												: '#fff',
										textDecoration: 'none',
										fontSize: '1rem',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										padding: '10px 32px',
										borderRadius: 4,
										fontWeight:
											pathname === item.path ? 700 : 400,
										background:
											pathname === item.path
												? '#292929'
												: 'none',
										transition:
											'background 0.2s, color 0.2s',
									}}
								>
									{item.label}{' '}
									<span
										style={{
											fontWeight: 600,
										}}
									>
										&#8250;
									</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</aside>

			{/* Main Content */}
			<main
				style={{
					marginLeft: 240,
					marginTop: 72,
					flex: 1,
					padding: '40px 48px 0 48px',
					minHeight: '100vh',
					background: '#f7f7f7',
				}}
			>
				{/* Dashboard Cards */}
				<div className='row col-md-12'
					style={{
						display: 'flex',
						gap: 32,
						marginBottom: 40,
					}}
				>
					<div className='col-md-3'
						style={{
							background: '#d6effa',
							borderRadius: 12,
							padding: '28px 36px',
							minWidth: 492,
							boxShadow: '0 2px 8px #0001',
						}}
					>
						<div
							style={{
								fontSize: 32,
								fontWeight: 700,
								color: '#222',
							}}
						>
							6
						</div>
						<div
							style={{
								color: '#222',
								fontWeight: 500,
								fontSize: 25,
								marginTop: 4,
							}}
						>
							Vendors{' '}
							<span
								style={{
									color: '#2196f3',
									fontWeight: 700,
									fontSize: 20,
									marginLeft: 4,
								}}
							>
								&#8250;
							</span>
						</div>
					</div>
					<div className='col-md-3'
						style={{
							background: '#fdf5d5',
							borderRadius: 12,
							padding: '28px 36px',
							minWidth: 492,
							boxShadow: '0 2px 8px #0001',
						}}
					>
						<div
							style={{
								fontSize: 32,
								fontWeight: 700,
								color: '#222',
							}}
						>
							982
						</div>
						<div
							style={{
								color: '#222',
								fontWeight: 500,
								fontSize: 25,
								marginTop: 4,
							}}
						>
							Flight Bookings{' '}
							<span
								style={{
									color: '#2196f3',
									fontWeight: 700,
									fontSize: 20,
									marginLeft: 4,
								}}
							>
								&#8250;
							</span>
						</div>
					</div>
					<div className='col-md-3'
						style={{
							background: '#fbe7d7',
							borderRadius: 12,
							padding: '28px 36px',
							minWidth: 492,
							boxShadow: '0 2px 8px #0001',
						}}
					>
						<div
							style={{
								fontSize: 32,
								fontWeight: 700,
								color: '#222',
							}}
						>
							6
						</div>
						<div
							style={{
								color: '#222',
								fontWeight: 500,
								fontSize: 25,
								marginTop: 4,
							}}
						>
							Hotel Bookings{' '}
							<span
								style={{
									color: '#2196f3',
									fontWeight: 700,
									fontSize: 20,
									marginLeft: 4,
								}}
							>
								&#8250;
							</span>
						</div>
					</div>
				</div>

				{/* New Leads Section */}
				<div
                    className='row col-md-12'
					style={{
						background: '#fff',
						borderRadius: 12,
						boxShadow: '0 2px 8px #0001',
						padding: 32,
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: 24,
						}}
					>
						<h2
							style={{
								fontWeight: 700,
								fontSize: 24,
								margin: 0,
							}}
						>
							New Leads
						</h2>
						<div
							style={{
								display: 'flex',
								gap: 12,
							}}
						>
							<button
								style={{
									background: '#F5F5F5',
									border: 'none',
									borderRadius: 24,
									padding: '8px 24px',
									fontWeight: 600,
									fontSize: 16,
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									boxShadow: '0 1px 4px #0001',
									color: '#222',
								}}
							>
								<span style={{ fontSize: 20 }}>✈️</span> Flights
							</button>
							<button
								style={{
									background: '#fdf5d5',
									border: 'none',
									borderRadius: 24,
									padding: '8px 24px',
									fontWeight: 600,
									fontSize: 16,
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									color: '#222',
								}}
							>
								<span style={{ fontSize: 20 }}>🏨</span> Hotels
							</button>
							<button
								style={{
									background: '#F5F5F5',
									border: 'none',
									borderRadius: 24,
									padding: '8px 24px',
									fontWeight: 600,
									fontSize: 16,
									display: 'flex',
									alignItems: 'center',
									gap: 8,
									boxShadow: '0 1px 4px #0001',
									color: '#222',
								}}
							>
								<span style={{ fontSize: 20 }}>🧳</span> Trip
							</button>
						</div>
					</div>
					<table
						style={{
							width: '100%',
							borderCollapse: 'collapse',
							fontSize: 16,
						}}
					>
						<thead>
							<tr
								style={{
									background: '#f5f5f5',
								}}
							>
								<th
									style={{
										textAlign: 'left',
										padding: '12px 16px',
										fontWeight: 700,
									}}
								>
									Name
								</th>
								<th
									style={{
										textAlign: 'left',
										padding: '12px 16px',
										fontWeight: 700,
									}}
								>
									Date
								</th>
								<th
									style={{
										textAlign: 'left',
										padding: '12px 16px',
										fontWeight: 700,
									}}
								>
									People
								</th>
								<th
									style={{
										textAlign: 'left',
										padding: '12px 16px',
										fontWeight: 700,
									}}
								>
									Date
								</th>
								<th
									style={{
										textAlign: 'left',
										padding: '12px 16px',
										fontWeight: 700,
									}}
								>
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{[1, 2, 3, 4].map((_, i) => (
								<tr
									key={i}
									style={{
										borderBottom: '1px solid #eee',
									}}
								>
									<td style={{ padding: '16px' }}>Rajesh Shah</td>
									<td style={{ padding: '16px' }}>Hotel</td>
									<td style={{ padding: '16px' }}>4 People</td>
									<td style={{ padding: '16px' }}>04 Sep 2025</td>
									<td style={{ padding: '16px' }}>
										<button
											style={{
												border: '1px solid #2196f3',
												color: '#2196f3',
												background: '#fff',
												borderRadius: 6,
												padding: '6px 18px',
												fontWeight: 600,
												fontSize: 15,
												marginRight: 8,
												cursor: 'pointer',
											}}
										>
											View Details
										</button>
										<span
											style={{
												color: '#e57373',
												fontSize: 22,
												cursor: 'pointer',
												verticalAlign: 'middle',
                                                marginLeft: 15
											}}
										>
											<Image
						src="/icons/delete.png"
						alt="delete"
						width={25}
						height={25}
					/>
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</main>
		</div>
	);
}
