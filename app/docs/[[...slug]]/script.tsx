'use client'
import { useEffect, useRef } from "react";

export default function CommentsScript({ issueNumber }: { issueNumber: number | undefined }) {
	const commentsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const script = document.createElement('script') as any
		if (!issueNumber) return;

		const theme = document.documentElement.style['colorScheme'] === 'dark' ? 'github-dark' : 'github-light'

		script.setAttribute('issue-number', issueNumber.toString())
		script.setAttribute('repo', 'lei4519/blog')
		script.setAttribute('theme', theme)
		script.setAttribute('crossOrigin', 'anonymous')
		script.setAttribute('async', 'true')
		script.setAttribute('id', 'utterances-script')
		script.setAttribute('src', 'https://utteranc.es/client.js')

		if (commentsRef.current?.children[0]) {
			commentsRef.current?.children[0].remove();
		}

		commentsRef.current?.appendChild(script)
	}, [issueNumber])

	useEffect(() => {
		document.querySelectorAll("blockquote > p > strong").forEach((el: any) => {
			const content = el.innerText;
			if (["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"].includes(content)) {
				el.classList.add(`alert-title`);
				const parent = el.parentElement?.parentElement;
				parent?.classList.add(`alert-box`);
				parent?.classList.add(content.toLowerCase());
			}
		});
	}, [issueNumber]);


	return <div key={issueNumber} ref={commentsRef} className="max-h-256 overflow-y-auto"></div>;
}


{/* <script>
  document.querySelectorAll("blockquote > p > strong").forEach((el) => {
    const content = el.innerText;
    if (["NOTE", "TIP", "IMPORTANT", "WARNING", "CAUTION"].includes(content)) {
      el.classList.add(`alert-title`);
      const parent = el.parentElement.parentElement;
      parent.classList.add(`alert-box`);
      parent.classList.add(content.toLowerCase());
    }
  });
</script> */}