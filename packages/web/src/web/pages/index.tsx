import { Navbar } from "../components/landing/navbar";
import { Hero, QuickActions } from "../components/landing/hero";
import { Astrologers } from "../components/landing/astrologers";
import { Categories } from "../components/landing/categories";
import { Reviews, Blogs } from "../components/landing/reviews-blogs";
import { AppDownload, Footer } from "../components/landing/app-footer";

function Index() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main>
        <Hero />
        <QuickActions />
        <Astrologers />
        <Categories />
        <Reviews />
        <Blogs />
        <AppDownload />
      </main>
      <Footer />
    </div>
  );
}

export default Index;
