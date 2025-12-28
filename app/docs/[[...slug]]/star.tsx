'use client';

import { Star, Github } from 'lucide-react';
import { useState } from 'react';

export default function GitHubStar() {
	const [isHovered, setIsHovered] = useState(false);
	const githubUrl = 'https://github.com/lei4519/blog'; // 请替换为你的 GitHub 仓库地址

	return (
		<div className="rounded-lg border-t border-fd-border bg-linear-to-br from-fd-background via-fd-background to-fd-muted/20 px-4 pb-6 pt-16 mt-8">
			<div className="flex flex-col items-center gap-4 text-center">
				{/* 标题 */}
				<div className="flex gap-2">
					<Star className="h-5 flex-none w-5 mt-[3px] text-yellow-500 fill-yellow-500" />
					<h3 className="text-lg font-semibold text-fd-foreground">
						觉得有帮助？给个 Star 支持一下吧！
					</h3>
				</div>

				{/* GitHub 按钮 */}
				<a
					href={githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="group relative inline-flex items-center gap-2 rounded-full bg-linear-to-r from-gray-800 via-gray-900 to-black px-6 py-3 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{/* 光效背景 */}
					<div className="absolute inset-0 rounded-full bg-linear-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />

					{/* 按钮内容 */}
					<div className="relative flex items-center gap-2">

						<Github
							className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'rotate-12 scale-110' : ''}`}
						/>
						<span>Star on GitHub</span>
						<Star
							className={`h-4 w-4 transition-all duration-300 ${isHovered ? 'fill-yellow-400 text-yellow-400 rotate-180' : 'fill-white'}`}
						/>
					</div>
				</a>
			</div>
		</div>
	);
}

