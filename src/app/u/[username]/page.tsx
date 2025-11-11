'use client'

interface Props {
	params: {
		id: string;
		username: string;

	};
}

export default function Page({ params }: Props) {
	const { id, username } = params;

	console.log(username)

	return (
		<>
			<h1>Page {id}</h1>
			<p>Page content</p>
		</>
	);
}
