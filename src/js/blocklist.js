/**
 * Get blocklist from any source.
 *
 * @returns {Promise<any|string>}
 */
export async function getBlocklist() {
	const blocklistFromStorage = getBlocklistFromStorage();
	
	if(blocklistFromStorage) {
		const blocklistDate = window.localStorage.getItem( 'blocklistDate' );
		
		if( blocklistDate < ( getUnixTime() - 604800 ) ) {
			await getBlocklistFromApi();
		}
		
		return blocklistFromStorage;
	} else {
		return await getBlocklistFromApi();
	}
}

/**
 * Get blocklist array from local storage.
 *
 * @returns {string[]|null}
 */
function getBlocklistFromStorage() {
	const stored = window.localStorage.getItem('blocklistContents');

	if (stored) {
		try {
			return JSON.parse(stored);
		} catch (e) {
			console.log( 'Failed to parse the blocklist from local storage.' );
		}
	}

	return null;
}

/**
 * Get blocklist array via the GitHub API.
 *
 * @returns {Promise<null|string[]>}
 */
async function getBlocklistFromApi() {
	let response = await fetch('https://raw.githubusercontent.com/splorp/wordpress-comment-blacklist/master/blacklist.txt');

	if (response.ok) {
		let text = await response.text();

		if (text) {
			const blocklistContents = text.split(/\r?\n/);

			window.localStorage.setItem('blocklistDate', getUnixTime().toString());
			window.localStorage.setItem('blocklistContents', JSON.stringify(blocklistContents));

			return blocklistContents;
		} else {
			console.log('Failed to parse WordPress comment blocklist.');
		}
	} else {
		console.log('Failed to retrieve WordPress comment blocklist from GitHub API.');
	}

	return null;
}

/**
 * Get current unix time in seconds.
 * 
 * @returns {number}
 */
function getUnixTime() {
	return Math.round( Date.now() / 1000 );
}
