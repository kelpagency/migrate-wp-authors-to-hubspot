# Migrate Authors from WordPress to HubSpot

HubSpot's built in blog migration tools don't currently support migrating author bios or profile images so I built this tool just for this purpose. This tool assumes the authors have already been migrated into HubSpot and it only syncs the bio and avatar. Feel free to adjust as needed for your purposes.

## Getting Started

Run `npm install` to install the 2 dependencies. Then, create a `.env` file by cloning the example file and updating the `HUBSPOT_TOKEN` with your access token and adding the your WordPress URL to the `WORDPRESS_URL`. Finally, create an application password inside WordPress via an admin account and add those credentials to the `.env` file as well.

Now, you should be able to run the script via `npm run start` and it will sync the data, woot!
