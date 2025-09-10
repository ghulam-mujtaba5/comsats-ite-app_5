import { Metadata } from 'next'
import { jsonLdBreadcrumb } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type EventRecord = {
	id: string
	title: string
	description: string
	event_date: string
	event_time: string
	location: string
	category: string
	organizer: string | null
	capacity: number | null
	registration_open: boolean
	image_url: string | null
	updated_at?: string | null
}

async function fetchEvent(id: string): Promise<EventRecord | null> {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
	try {
		const res = await fetch(`${siteUrl}/api/news-events/events/${id}`, { cache: 'no-store' })
		if (!res.ok) return null
		const json = await res.json()
		return json?.data || null
	} catch {
		return null
	}
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
	const evt = await fetchEvent(params.id)
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
	if (!evt) return { title: params.id }
	const title = `${evt.title} | Event`
	const description = evt.description?.slice(0,160) || 'Campus event details.'
	const canonical = `/news-events/${params.id}`
	const image = evt.image_url ? new URL(evt.image_url, siteUrl).toString() : new URL('/og-preview.png', siteUrl).toString()
		return {
			title,
			description,
			alternates: { canonical },
			openGraph: {
				type: 'website',
				url: new URL(canonical, siteUrl).toString(),
				title,
				description,
				images: [{ url: image, width: 1200, height: 630, alt: evt.title }],
			},
			twitter: { card: 'summary_large_image', title, description, images: [image] },
		}
}

export default async function EventPage({ params }: { params: { id: string } }) {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
	const evt = await fetchEvent(params.id)
	if (!evt) {
		return <div className="container mx-auto py-24"><h1 className="text-2xl font-bold">Event not found</h1></div>
	}

	const startISO = evt.event_date ? new Date(`${evt.event_date}T${(evt.event_time||'09:00').replace(/\s+/g,'')}:00`).toISOString() : undefined
	// Assume 2h duration if no explicit end
	const endISO = startISO ? new Date(new Date(startISO).getTime() + 2*60*60*1000).toISOString() : undefined

	const eventLd = {
		'@context': 'https://schema.org',
		'@type': 'Event',
		name: evt.title,
		description: evt.description,
		startDate: startISO,
		endDate: endISO,
		eventStatus: 'https://schema.org/EventScheduled',
		eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
		location: {
			'@type': 'Place',
			name: evt.location,
			address: evt.location,
		},
		organizer: evt.organizer ? { '@type': 'Organization', name: evt.organizer } : { '@type': 'Organization', name: 'CampusAxis' },
		image: evt.image_url ? [new URL(evt.image_url, siteUrl).toString()] : [new URL('/og-preview.png', siteUrl).toString()],
		url: new URL(`/news-events/${evt.id}`, siteUrl).toString(),
	}

	const breadcrumb = jsonLdBreadcrumb([
		{ name: 'Home', path: '/' },
		{ name: 'News & Events', path: '/news-events' },
		{ name: evt.title, path: `/news-events/${evt.id}` },
	])

	return (
		<div className="container mx-auto max-w-3xl py-16 px-4">
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([eventLd, breadcrumb]) }} />
			<p className="text-sm text-muted-foreground mb-4">Campus Event</p>
			<h1 className="text-4xl font-bold tracking-tight mb-6">{evt.title}</h1>
			<div className="space-y-2 text-sm text-muted-foreground mb-8">
				<div><strong>Date:</strong> {evt.event_date}</div>
				{evt.event_time && <div><strong>Time:</strong> {evt.event_time}</div>}
				<div><strong>Location:</strong> {evt.location}</div>
				{evt.organizer && <div><strong>Organizer:</strong> {evt.organizer}</div>}
				{evt.capacity ? <div><strong>Capacity:</strong> {evt.capacity}</div> : null}
			</div>
			<article className="prose dark:prose-invert max-w-none">
				<p>{evt.description}</p>
			</article>
		</div>
	)
}
