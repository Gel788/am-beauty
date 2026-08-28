import { HomeBenefits } from "@/components/home/benefits";
import { HomeBestsellers } from "@/components/home/bestsellers";
import { HomeCategories } from "@/components/home/categories";
import { HomeFeatured } from "@/components/home/featured";
import { HomeHero } from "@/components/home/hero";
import { HomeManifesto } from "@/components/home/manifesto";
import { HomeNewsletter } from "@/components/home/newsletter";
import { HomeReviews } from "@/components/home/reviews";
import { HomeRitual } from "@/components/home/ritual";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeFeatured />
      <HomeManifesto />
      <HomeRitual />
      <HomeBestsellers />
      <HomeCategories />
      <HomeBenefits />
      <HomeReviews />
      <HomeNewsletter />
    </>
  );
}
