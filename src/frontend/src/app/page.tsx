"use client";

import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard/Dashboard';

export default function HomePage() {
  // ホームページにアクセスした場合はダッシュボードにリダイレクト
  redirect('/dashboard');
}
