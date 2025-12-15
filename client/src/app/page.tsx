import PublicLayout from '@/app/(public)/layout';
import Banner from '@/components/modules/home/Banner';
import Introduction from '@/components/modules/home/Introduction';
import CoreValues from '@/components/modules/home/CoreValues';
import LatestNews from '@/components/modules/home/LatestNews';
import ContactSection from '@/components/modules/home/ContactSection';
import { articleService } from '@/services/article.service';
import styles from './page.module.css'

async function getLatestArticles() {
  try {
    const res = await articleService.getPublicArticles({ page: 1, limit: 6 });
    return res.data;
  } catch (error) {
    console.error("Lỗi fetch tin tức:", error);
    return [];
  }
}

export default async function Home() {
  const articles = await getLatestArticles();

  return (
    <PublicLayout>
      <div className={styles.container}>

        <section id="hero" className={styles.section}>
          <Banner />
        </section>

        <section id="about" className={styles.section}>
          <Introduction />
          <CoreValues />
        </section>

        <section id="news" className={styles.section}>
          <LatestNews articles={articles} />
        </section>

        <section id="contact" className={styles.section}>
          <ContactSection />
        </section>

      </div>
    </PublicLayout>
  );
}