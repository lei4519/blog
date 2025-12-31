'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Redirect() {
	useEffect(() => {
		redirect('/docs');
	}, []);
	return null;
}