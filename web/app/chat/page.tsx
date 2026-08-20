import type { Metadata } from 'next';
import Masthead from '@/components/Masthead';
import Footer from '@/components/Footer';
import ChatPage from '@/components/ChatPage';

export const metadata: Metadata = {
  title: 'Ask my CV',
  description:
    'Ask questions about Abdelhamid Attaby’s fifteen years of engineering experience — GitHub, multi-agent AI systems, distributed systems and technical leadership. Answers come only from his CV.',
  alternates: { canonical: '/chat/' },
};

export default function Page() {
  return (
    <>
      <Masthead />
      <main id="main">
        <ChatPage />
      </main>
      <Footer />
    </>
  );
}
