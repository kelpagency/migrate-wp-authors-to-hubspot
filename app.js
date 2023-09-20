import "dotenv/config";
import { Client } from "@hubspot/api-client";

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_TOKEN });

const headers = new Headers();
headers.set(
	"Authorization",
	"Basic " +
		Buffer.from(process.env.WORDPRESS_USERNAME + ":" + process.env.WORDPRESS_TOKEN).toString("base64")
);

async function getWpUsers() {
	const response = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/users?roles=author&per_page=100`, {
		method: "GET",
		headers: headers
	});
	const users = await response.json();
}

async function getWpUserByName(name) {
	const response = await fetch(`${process.env.WORDPRESS_URL}/wp-json/wp/v2/users?search=${name}`, {
		method: "GET",
		headers: headers
	});
	const user = await response.json();
	if (user) {
		return user;
	}
}

async function getHsUsers(per_page) {
	const createdAt = undefined;
	const createdAfter = undefined;
	const createdBefore = undefined;
	const updatedAt = undefined;
	const updatedAfter = undefined;
	const updatedBefore = undefined;
	const sort = undefined;
	const after = undefined;
	const limit = per_page;
	const archived = undefined;
	const property = undefined;

	const apiResponse = await hubspotClient.cms.blogs.authors.blogAuthorsApi.getPage(
		createdAt,
		createdAfter,
		createdBefore,
		updatedAt,
		updatedAfter,
		updatedBefore,
		sort,
		after,
		limit,
		archived,
		property
	);

	return apiResponse;
}

async function updateHsUser(id, updatedData) {
	try {
		const apiResponse = await hubspotClient.cms.blogs.authors.blogAuthorsApi.update(id, updatedData);
	} catch (e) {
		e.message === "HTTP request failed"
			? console.error(JSON.stringify(e.response, null, 2))
			: console.error(e);
	}
}

async function updateUsers() {
	const fetchUsers = async () => await getHsUsers(2750);
	const hsUsers = await fetchUsers();

	for (const user of hsUsers.results) {
		// get the data from WordPress first
		const getWpUser = async () => await getWpUserByName(user.displayName);
		const wpUser = await getWpUser();

		// only update HubSpot author if both names match exactly
		if (user.displayName === wpUser[0]?.name) {
			const wpUserData = {
				bio: wpUser[0].description,
				avatar: wpUser[0].avatar_urls["96"]
			};

			// Wrap the updateUser call in a Promise to add a delay
			// adjust as needed based on your HubSpot portal's API rate limits
			const updateUser = async () => {
				return new Promise((resolve) => {
					setTimeout(async () => {
						const updatedUser = await updateHsUser(user.id, wpUserData);
						console.log("Updated User: " + user.displayName);
						console.log(wpUserData);
						resolve(updatedUser);
					}, 300); // 300ms second delay
				});
			};

			await updateUser();
		}
	}
}

updateUsers();
