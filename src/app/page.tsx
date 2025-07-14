import BestPlacesToStay from '@/components/BestPlacesToStay';
import ExclusiveDeals from '@/components/ExclusiveDeals';
import Footer from '@/components/Footer';
import HappyCustomers from '@/components/HappyCustomers';
import Header from '@/components/Header';
import HeroSearch from '@/components/HeroSearch';
import ReadTravelStories from '@/components/ReadTravelStories';
import TrendingDestinations from '@/components/TrendingDestinations';
import WhyChooseUs from '@/components/WhyChooseUs';

export default function Home() {
  return (
    <>
      <Header />
      <HeroSearch />
      <ExclusiveDeals />
      <TrendingDestinations/>
      <BestPlacesToStay />
      <hr style={{ borderTop: '2px solid rgb(110 112 114)', margin: '1rem 0' }} />
      <ReadTravelStories />
      <hr style={{ borderTop: '2px solid rgb(110 112 114)', margin: '1rem 0' }} />
      <HappyCustomers />
      <hr style={{ borderTop: '2px solid rgb(110 112 114)', margin: '1rem 0' }} />
      <WhyChooseUs />
      <Footer />
    </>
  );
}
