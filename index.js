import axios from 'axios';
import EventEmitter from 'eventemitter3';

import { Wallet } from 'aep';

try {
	var IPFS_MAIN = require('ipfs');
} catch (e) { 
	console.log(e);
}

let AlexandriaCore = (function(){
	let Core = {};

	// Initiate all instances
	try {
		Core.ipfs = new IPFS_MAIN({
			init: true,
			start: true,
			EXPERMENTAL: {
				pubsub: false,
				sharding: false,
				dht: true
			},
			config: {
				Addresses: {
					Swarm: [
						'/ip4/163.172.37.165/tcp/4001/ipfs/QmRvfRjoCCwVLbVAiYWqJJCiQKqGqSuKckv4eDKEHZXxZu',
						"/ip4/69.172.212.23/tcp/4001/ipfs/QmXUcnxbsDkazGNvgf1kQya6YwVqNsLbVhzg3LHNTteqwz",
						// "/ip4/69.172.212.23/tcp/4002/ws/ipfs/QmXUcnxbsDkazGNvgf1kQya6YwVqNsLbVhzg3LHNTteqwz",
						"/ip4/192.99.6.117/tcp/4001/ipfs/QmQ85u4dH4EPRpNxLxBMvUCHCUyuyZgBZsfW81rzh51FtY",
						"/ip6/2607:5300:60:3775::/tcp/4001/ipfs/QmQ85u4dH4EPRpNxLxBMvUCHCUyuyZgBZsfW81rzh51FtY"
					]
				}
			}
		});
	} catch (e) {
		Core.ipfs = "not-supported"
	}
	

	// Define all of the application URLS
	Core.OIPdURL = "https://api.alexandria.io/alexandria/v2";
	Core.IPFSGatewayURL = "https://gateway.ipfs.io/ipfs/";
	Core.issoURL = "https://isso.alexandria.io/";

	// Define URLS for things we don't control, these likely will change often
	Core.btcTickerURL = "https://blockchain.info/ticker?cors=true";
	Core.floTickerURL = "https://api.alexandria.io/flo-market-data/v1/getAll"
	Core.ltcTickerURL = "https://api.coinmarketcap.com/v1/ticker/litecoin/"

	Core.getEventEmitter = function(){
		return CoreEvents;
	}

	Core.Artifact = {};

	Core.Artifact.maxThumbnailSize = 512000;

	Core.Artifact.getTXID = function(oip){
		let txid = "";
		try {
			txid = oip.txid
		} catch(e) {}
		return txid;
	}

	Core.Artifact.getTitle = function(oip){
		let title = "";
		try {
			title = oip['oip-041'].artifact.info.title
		} catch(e) {}
		return Core.util.decodeMakeJSONSafe(title);
	}

	Core.Artifact.getType = function(oip){
		let type = "";
		try {
			type = oip['oip-041'].artifact.type.split('-')[0];
		} catch(e) {}
		return type;
	}

	Core.Artifact.getSubtype = function(oip){
		let subtype = "";
		try {
			subtype = oip['oip-041'].artifact.type.split('-')[1];
		} catch(e) {}
		return subtype;
	}

	Core.Artifact.getDescription = function(oip){
		let description = "";
		try {
			description = oip['oip-041'].artifact.info.description;

		} catch(e) {}
		return Core.util.decodeMakeJSONSafe(description);
	}

	Core.Artifact.getFiles = function(oip){
		let files = [];
		try {
			let tmpFiles = oip['oip-041'].artifact.storage.files;

			for (let i = 0; i < tmpFiles.length; i++) {
				files.push(tmpFiles[i])
			}
		} catch(e) {}

		return [...files];
	}

	Core.Artifact.getLocation = function(oip){
		let location = "";
		try {
			location = oip['oip-041'].artifact.storage.location
		} catch(e) {}
		return location;
	}

	Core.Artifact.getTimestamp = function(oip){
		let timestamp = 0;
		try {
			timestamp = oip['oip-041'].artifact.timestamp
		} catch(e) {}
		return timestamp;
	}

	Core.Artifact.getPublisherName = function(oip){
		let pubName = "Flotoshi";

		try {
			pubName = oip.publisherName
		} catch(e) {}

		return pubName;
	}

	Core.Artifact.getPublisher = function(oip){
		let pubName = "";

		try {
			pubName = oip.publisher
		} catch(e) {}

		return pubName;
	}

	Core.Artifact.getArtist = function(oip){
		let artist = "";
		try {
			artist = oip['oip-041'].artifact.info.extraInfo.artist
		} catch(e) {}

		if (artist === ""){
			try {
				artist = Core.Artifact.getPublisherName(oip);
			} catch(e) {}
		}

		return artist;
	}

	Core.Artifact.getScale = function(oip){
		let scale = 1;

		try {
			let tmpScale = oip['oip-041'].artifact.payment.scale;

			if (tmpScale && tmpScale.split(":").length === 2){
				scale = tmpScale.split(":")[0];
			}
		} catch (e) {}

		return scale 
	}

	Core.Artifact.getMainFile = function(oip, type){
		let mainFile;

		let files = Core.Artifact.getFiles(oip);
		let location = Core.Artifact.getLocation(oip);

		if (!type){
			type = Core.Artifact.getType(oip);
		}

		for (let i = 0; i < files.length; i++){
			if (files[i].type === type && !mainFile){
				mainFile = files[i];
			}
		}

		// If no file is found with the correct type, default to use the first file in the Artifact
		if (!mainFile){
			if (files[0])
				mainFile = files[0];
		}

		return mainFile;
	}

	Core.Artifact.getDuration = function(oip){
		let duration;

		let files = Core.Artifact.getFiles(oip);

		for (var i = files.length - 1; i >= 0; i--) {
			if (files[i].duration && !duration)
				duration = files[i].duration;
		}

		return duration;
	}

	Core.Artifact.getMainPaidFile = function(oip, type){
		let mainFile;

		let files = Core.Artifact.getFiles(oip);
		let location = Core.Artifact.getLocation(oip);

		for (let i = 0; i < files.length; i++){
			if (files[i].type === type && (files[i].sugPlay !== 0 || files[i].sugBuy !== 0) && !mainFile){
				mainFile = files[i];
			}
		}

		return mainFile;
	}

	Core.Artifact.getMainFileSugPlay = function(oip, type){
		let sugPlay = 0;

		try {
			sugPlay = Core.Artifact.getMainPaidFile(oip, type).sugPlay / Core.Artifact.getScale(oip);
		} catch (e) {}

		return sugPlay 
	}

	Core.Artifact.getMainFileSugBuy = function(oip, type){
		let sugBuy = 0;

		try {
			sugBuy = Core.Artifact.getMainPaidFile(oip, type).sugBuy / Core.Artifact.getScale(oip);
		} catch (e) {}

		return sugBuy
	}

	Core.Artifact.getMainFileDisPlay = function(oip, type){
		let disPlay = false;

		try {
			disPlay = Core.Artifact.getMainPaidFile(oip, type).disPlay;
		} catch (e) {}

		if (!disPlay)
			disPlay = false;

		return disPlay
	}

	Core.Artifact.getMainFileDisBuy = function(oip, type){
		let disBuy = 0;

		try {
			disBuy = Core.Artifact.getMainPaidFile(oip, type).disBuy;
		} catch (e) {}

		if (!disBuy)
			disBuy = false;

		return disBuy
	}

	Core.Artifact.getThumbnail = function(oip){
		let thumbnail;

		let files = Core.Artifact.getFiles(oip);
		let location = Core.Artifact.getLocation(oip);

		for (let i = 0; i < files.length; i++){
			if (files[i].type === "Image" && files[i].subtype === "cover" && !files[i].sugPlay && !files[i].disPlay && files[i].fsize < Core.Artifact.maxThumbnailSize && !thumbnail){
				thumbnail = files[i];
			}
		}

		if (!thumbnail){
			for (let i = 0; i < files.length; i++){
				if (files[i].type === "Image" && !files[i].sugPlay && !files[i].disPlay && files[i].fsize < Core.Artifact.maxThumbnailSize && !thumbnail){
					thumbnail = files[i];
				}
			}
		}

		return thumbnail;
	}

	Core.Artifact.getAlbumArt = function(oip){
		let albumArt;

		let files = Core.Artifact.getFiles(oip);

		for (let i = 0; i < files.length; i++){
			if (files[i].type === "Image" && files[i].subtype === "cover" && !files[i].sugPlay && !albumArt){
				albumArt = files[i];
			}
		}

		if (!albumArt){
			for (let i = 0; i < files.length; i++){
				if (files[i].type === "Image" && files[i].subtype === "album-art" && !files[i].sugPlay && !albumArt){
					albumArt = files[i];
				}
			}
		}

		if (!albumArt){
			albumArt = Core.Artifact.getThumbnail(oip);
		}

		return albumArt;
	}

	Core.Artifact.getFirstImage = function(oip){
		let imageGet;

		let files = Core.Artifact.getFiles(oip);
		//let location = Core.Artifact.getLocation(oip);

		for (let i = 0; i < files.length; i++){
			if (files[i].type === "Image" && !imageGet){
				imageGet = files[i];
			}
		}

		// let imageURL = "";

		// if (imageGet){
		// 	imageURL = location + "/" + imageGet.fname;
		// }

		return imageGet;
	}

	Core.Artifact.getFirstHTML = function(oip){
		let htmlGet;

		let files = Core.Artifact.getFiles(oip);
		let location = Core.Artifact.getLocation(oip);

		for (let i = 0; i < files.length; i++){
			let extension = Core.util.getExtension(files[i].fname);
			if ((extension === "html" || extension === "HTML") && !htmlGet){
				htmlGet = files[i];
			}
		}

		let htmlURL = "";

		if (htmlGet){
			htmlURL = location + "/" + htmlGet.fname;
		}

		return htmlURL;
	}

	Core.Artifact.getFirstHTMLURL = function(oip){
		let htmlGet;

		let files = Core.Artifact.getFiles(oip);
		let location = Core.Artifact.getLocation(oip);

		for (let i = 0; i < files.length; i++){
			let extension = Core.util.getExtension(files[i].fname);
			if ((extension === "html" || extension === "HTML") && !htmlGet){
				htmlGet = files[i];
			}
		}

		let htmlURL = "";

		if (htmlGet){
			htmlURL = location + "/" + htmlGet.fname;
		}

		return Core.util.buildIPFSURL(htmlURL);
	}

	Core.Artifact.getSongs = function(oip){
		let files = Core.Artifact.getFiles(oip);
		let location = Core.Artifact.getLocation(oip);
		let artist = Core.Artifact.getArtist(oip);

		let albumArtwork = Core.Artifact.getAlbumArt(oip);

		let albumArtUrl = Core.util.buildIPFSURL(Core.util.buildIPFSShortURL(oip, albumArtwork));

		let songs = [];

		for (var i = 0; i < files.length; i++){
			if (files[i].type === "Audio"){
				let durationNice = Core.util.formatDuration(files[i].duration);

				let songObj = JSON.parse(JSON.stringify(files[i]));

				songObj.location = location;
				songObj.artist = files[i].artist ? files[i].artist : artist
				songObj.name = files[i].dname ? files[i].dname : files[i].fname
				songObj.albumArtwork = albumArtUrl
				songObj.length = durationNice

				songs.push(songObj);
			}
		}

		return songs;
	}

	Core.Artifact.getEntypoIconForType = function(type){
		let icon;

		switch(type){
			case "Audio":
				icon = "beamed-note";
				break;
			case "Video":
				icon = "clapperboard";
				break;
			case "Image":
				icon = "image";
				break;
			case "Text":
				icon = "text";
				break;
			case "Software":
				icon = "code";
				break;
			case "Web":
				icon = "code";
				break;
			default:
				icon = "";
				break;
		}

		return icon;
	}

	Core.Artifact.paid = function(oip){
		let files = oip['oip-041'].artifact.storage.files;

		let paid = false;
		if (files){
			for (var i = 0; i < files.length; i++){
				if (files[i].sugPlay || files[i].sugBuy)
					paid = true;
			}
		}

		return paid;
	}

	Core.Artifact.isFilePaid = function(file){
		let paid = false;
		
		if (file.sugPlay || file.sugBuy)
			paid = true;

		return paid;
	}

	Core.Artifact.checkPaidViewFile = function(file){
		let paid = false;
		if (file.sugPlay)
			paid = true;

		return paid;
	}

	Core.Artifact.getFormattedVideoQualities = function(oip){
		let files = Core.Artifact.getFiles(oip);

		let qualityArr = [];

		for (var i = files.length - 1; i >= 0; i--) {
			if (files[i].subtype === "HD720" || 
				files[i].subtype === "SD480" || 
				files[i].subtype === "LOW320" || 
				files[i].subtype === "MOB240"){
				qualityArr.push({
					format: files[i].subtype,
					src: Core.util.buildIPFSURL(Core.util.buildIPFSShortURL(oip, files[i])),
					type: "video/" + Core.util.getExtension(files[i].fname)
				})
			}

		}
	}

	Core.Artifact.getPaymentAddresses = function(oip, file){
		let addrs = [];

		try {
			addrs = oip['oip-041'].artifact.payment.addresses;

			if (addrs.length === 0)
				addrs = {'florincoin': Core.Artifact.getPublisher(oip)};
		} catch (e) {}

		return addrs;
	}

	Core.Comments = {};

	Core.Comments.get = function(hash, callback){
		Core.Network.getCommentsFromISSO("/browser/" + hash, function(results){
			console.log(results);
			callback(results);
		})
	}

	Core.Comments.add = function(hash, comment, callback){
		Core.Network.postCommentToISSO("/browser/" + hash, {text: comment}, function(results){
			console.log(results)
			callback(results);
		})
	}

	Core.Comments.like = function(id, callback){
		Core.Network.likeISSOComment(id, function(results){
			console.log(results)
			callback(results);
		})
	}

	Core.Comments.dislike = function(id, callback){
		Core.Network.dislikeISSOComment(id, function(results){
			console.log(results)
			callback(results);
		})
	}

	Core.Data = {};

	Core.Data.getBTCPrice = function(callback){
		// Check to see if we should update again, if not, just return the old data.
		Core.Network.getLatestBTCPrice(callback);
	}

	Core.Data.getFLOPrice = function(callback){
		// Check to see if we should update again, if not, just return the old data.
		Core.Network.getLatestFLOPrice(callback);
	}

	Core.Data.getLTCPrice = function(callback){
		// Check to see if we should update again, if not, just return the old data.
		Core.Network.getLatestLTCPrice(callback);
	}

	Core.Events = {};

	Core.Events.emitter = new EventEmitter();

	Core.Events.on = function(eventType, runMe){
		Core.Events.emitter.on(eventType, runMe);
	}

	Core.Index = {};

	Core.Index.supportedArtifacts = [];

	Core.Index.getSupportedArtifacts = function(callback){
		Core.Network.getArtifactsFromOIPd(function(jsonResult) {
			let filtered = Core.Index.stripUnsupported(jsonResult);
			callback([...filtered]);
		});
	}

	Core.Index.getSuggestedContent = function(userid, callback){
		let _Core = Core;
		// In the future we will generate content specific for users, for now, just the generic is ok :)
		// userid is not currently implemented or used.
		Core.Index.getSupportedArtifacts(function(supportedArtifacts){
			console.log(supportedArtifacts)
			if (supportedArtifacts.length > 25){
				callback(supportedArtifacts.slice(0,25));
			} else {
				callback(supportedArtifacts);
			}
		})
	}

	Core.Index.stripUnsupported = function(artifacts){
		var supportedArtifacts = [];

		for (var x = artifacts.length -1; x >= 0; x--){
			if (artifacts[x]['oip-041']){
				if (artifacts[x]['oip-041'].artifact.type.split('-').length === 2){
					if (!artifacts[x]['oip-041'].artifact.info.nsfw)
						supportedArtifacts.push(JSON.parse(JSON.stringify(artifacts[x])));
				}
			}
		}   

		return [...supportedArtifacts];
	}

	Core.Index.getArtifactFromID = function(id, callback){
		Core.Index.getSupportedArtifacts(function(supportedArtifacts){
			for (var i = 0; i < supportedArtifacts.length; i++) {
				if (supportedArtifacts[i].txid.substr(0, id.length) === id){
					callback([...[supportedArtifacts[i]]]);
				}
			}
		})
	}

	Core.Index.search = function(options, onSuccess, onError){
		Core.Network.searchOIPd(options, function(results){
			let res = Core.Index.stripUnsupported(results);

			onSuccess(res);
		}, function(error){
			onError(error);
		})
	}

	Core.Index.getPublisher = function(id, onSuccess, onError){
		Core.Network.searchOIPd({"protocol": "publisher", "search-on": "address", "search-for": id}, function(results){
			onSuccess(results[0]['publisher-data']['alexandria-publisher']);
		}, function(err){
			onError(err);
		});
	}

	Core.Index.getRandomSuggested = function(onSuccess){
		Core.Index.getSupportedArtifacts(function(results){
			let randomArt = results.sort( function() { return 0.5 - Math.random() } ).slice(0,15);
			onSuccess(randomArt);
		});
	}

	Core.Network = {};

	Core.Network.cachedArtifacts = [];
	Core.Network.artifactsLastUpdate = 0; // timestamp of last ajax call to the artifacts endpoint.
	Core.Network.artifactsUpdateTimelimit = 5 * 60 * 1000; // Five minutes
	Core.Network.cachedBTCPriceObj = {};
	Core.Network.cachedFLOPriceObj = {};
	Core.Network.cachedLTCPriceObj = {};
	Core.Network.btcpriceLastUpdate = 0;
	Core.Network.flopriceLastUpdate = 0;
	Core.Network.ltcpriceLastUpdate = 0;
	Core.Network.btcpriceUpdateTimelimit = 5 * 60 * 1000; // Five minutes
	Core.Network.flopriceUpdateTimelimit = 5 * 60 * 1000; // Five minutes
	Core.Network.ltcpriceUpdateTimelimit = 5 * 60 * 1000; // Five minutes

	Core.Network.searchOIPd = function(options, onSuccess, onError){
		let defaultOptions = {
			"protocol" : "media", 
			"search-on": "*", 
			"search-like": true
		}

		if (!options.protocol)
			options.protocol = defaultOptions.protocol;

		if (!options["search-on"])
			options["search-on"] = defaultOptions["search-on"];

		if (!options["search-like"]){
			if (options.protocol === "publisher" && options["search-on"] === "address")
				options["search-like"] = false;
			else
				options["search-like"] = defaultOptions["search-like"];
		}

		let _Core = Core;

		axios.post(Core.OIPdURL + "/search", options)
		.then(function(results){
			if (results && results.data && results.data.status === "success" && results.data.response)
				onSuccess([...results.data.response]);
			else
				onError(results);
		});
	}

	Core.Network.getArtifactsFromOIPd = function(callback){
		if ((Date.now() - Core.Network.artifactsLastUpdate) > Core.Network.artifactsUpdateTimelimit){
			axios.get(Core.OIPdURL + "/media/get/all", {
				transformResponse: [function (data) {
					return [...data]; 
				}], responseType: 'json'
			}).then( function(results){ 
				Core.Network.cachedArtifacts = results.data;
				Core.Network.artifactsLastUpdate = Date.now();
				callback(Core.Network.cachedArtifacts);
			 });
		} else {
			callback(Core.Network.cachedArtifacts);
		}
	}

	Core.Network.getLatestBTCPrice = function(callback){
		if (Core.Network.btcpriceLastUpdate < Date.now() - Core.Network.btcpriceUpdateTimelimit || Core.Network.cachedBTCPriceObj === {}){
			let _Core = Core;

			axios.get(Core.btcTickerURL).then(function(result){
				if (result.status === 200){
					_Core.Network.cachedBTCPriceObj = result.data;
					_Core.Network.btcpriceLastUpdate = Date.now();
					callback(_Core.Network.cachedBTCPriceObj["USD"].last);
				}
			});
		} else {
			callback(Core.Network.cachedBTCPriceObj["USD"].last);
		}
	}

	Core.Network.getLatestFLOPrice = function(callback){
		if (Core.Network.flopriceLastUpdate < Date.now() - Core.Network.flopriceUpdateTimelimit || Core.Network.cachedFLOPriceObj === {}){
			let _Core = Core;

			axios.get(Core.floTickerURL).then(function(result){
				if (result.status === 200){
					_Core.Network.cachedFLOPriceObj = result.data;
					_Core.Network.flopriceLastUpdate = Date.now();
					callback(_Core.Network.cachedFLOPriceObj["USD"]);
				}
			});
		} else {
			callback(Core.Network.cachedFLOPriceObj["USD"]);
		}
	}

	Core.Network.getLatestLTCPrice = function(callback){
		if (Core.Network.ltcpriceLastUpdate < Date.now() - Core.Network.ltcpriceUpdateTimelimit || Core.Network.cachedLTCPriceObj === {}){
			let _Core = Core;

			axios.get(Core.ltcTickerURL).then(function(result){
				if (result.status === 200){
					_Core.Network.cachedLTCPriceObj = result.data;
					_Core.Network.ltcpriceLastUpdate = Date.now();
					callback(_Core.Network.cachedLTCPriceObj[0]["price_usd"]);
				}
			});
		} else {
			callback(Core.Network.cachedLTCPriceObj[0]["price_usd"]);
		}
	}

	Core.Network.getIPFS = function(callback){
		Core.ipfs.on('ready', () => {
			callback(Core.ipfs);
		})
	}

	Core.Network.getThumbnailFromIPFS = function(hash, onData, onEnd){
		let returned = false;
		let cancelRequest = false;

		let cancelRequestFunc = function(){
			returned = true;
			cancelRequest = true;
		}
		// Require a hash to be passed
		if (!hash || hash === ""){
			returned = true;
			return cancelRequestFunc;
		}

		if (!onEnd){
			onEnd = function(){}
		}

		try {
			Core.ipfs.files.catReadableStream(hash, function (err, file) {
				if (err){
					returned = true;
					return cancelRequestFunc;
				}

				let stream = file;

				if (cancelRequest){
					try {
						stream.destroy();
					} catch(e){}
					return;
				}

				let chunks = [];
				let lastdata = 0;
				if (stream){
					stream.on('data', function(chunk) {
						// If the request was aborted, ABORT ABORT ABORT!
						if (cancelRequest){
							return;
						}

						chunks.push(chunk);

						// Note, this might cause tons of lag depending on how many ongoing IPFS requests we have.
						if (Date.now() - lastdata > 1000){
							lastdata = Date.now();
							Core.util.chunksToFileURL(chunks, function(data){
								onData(data, hash);
								returned = true;
							})
						}
					});
					stream.on('end', function(){
						if (cancelRequest)
							return;

						Core.util.chunksToFileURL(chunks, function(data){
							onData(data, hash);
						})
					})
				}
			})
		} catch (e){ 
			if (cancelRequest)
				return cancelRequestFunc;

			onData(Core.util.buildIPFSURL(hash), hash);
			returned = true;
		}

		setTimeout(function(){
			if (cancelRequest)
				return cancelRequestFunc;

			if (!returned){
				onData(Core.util.buildIPFSURL(hash), hash);
			}
		}, 2 * 1000)

		return cancelRequestFunc;
	}

	Core.Network.getFileFromIPFS = function(hash, onComplete){
		// Require a hash to be passed
		if (!hash || hash === "")
			return;

		let returned = false;

		try {
			Core.ipfs.files.cat(hash, function (err, file) {
				if (err){
					returned = true;
					return;
				}

				let stream = file;
				let chunks = [];
				if (stream){
					stream.on('data', function(chunk) {
						chunks.push(chunk);
					});
					stream.on('end', function(){
						Core.util.chunksToFileURL(chunks, function(data){
							onComplete(data, hash);
							returned = true;
						})
					})
				}
			})
		} catch(e) { }

		setTimeout(function(){
			if (!returned){
				onComplete(Core.util.buildIPFSURL(hash), hash);
			}
		}, 2 * 1000)
	}

	Core.Network.getCommentsFromISSO = function(uri, callback){
		axios.get(Core.issoURL + "?uri=" + encodeURIComponent(uri)).then(function(results){
			callback(results);
		}).catch(function (error) {
			// If there is an error, it is likely because the artifact has no comments, just return an empty array.
			callback([]);
		});
	}

	Core.Network.postCommentToISSO = function(uri, comment, callback){
		var instance = axios.create();

		instance.post(Core.issoURL + "new?uri=" + encodeURIComponent(uri), comment, {headers: {"Content-Type": "application/json"}, transformRequest: [(data, headers) => {
		    delete headers.common.Authorization
		    return data }]
		}).then(function(results){
			callback(results);
		}).catch(function (error) {
			// If there is an error, it is likely because the artifact has no comments, just return an empty array.
			callback({error: true});
		});
	}

	Core.Network.likeISSOComment = function(id, callback){
		axios.post(Core.issoURL + "id/" + id + "/like", {}).then(function(results){
			callback(results);
		}).catch(function (error) {
			// If there is an error, it is likely because the artifact has no comments, just return an empty array.
			callback({error: true});
		});
	}

	Core.Network.dislikeISSOComment = function(id, callback){
		axios.post(Core.issoURL + "id/" + id + "/dislike", {}).then(function(results){
			callback(results);
		}).catch(function (error) {
			// If there is an error, it is likely because the artifact has no comments, just return an empty array.
			callback({error: true});
		});
	}

	Core.User = {};

	Core.User.Identifier = "";
	Core.User.Password = "";

	Core.User.Login = function(identifier, password, onSuccess, onError){
		if (!onSuccess)
			onSuccess = function(){};
		if (!onError)
			onError = function(){};

		console.log("hellow");

		Core.Wallet.Login(identifier, password, (state) => {
			console.log("success");
			// If we have florincoin addresses
			if (state.florincoin){
				if (state.florincoin.addresses){
					let gotFirstPublisher = false;

					for (var i = 0; i < state.florincoin.addresses.length; i++) {
						Core.Index.getPublisher(state.florincoin.addresses[i].address, (pubInfo) => {
							if (!gotFirstPublisher){
								gotFirstPublisher = true;
								onSuccess(pubInfo)
							}
						}, (error) => {
							// Address is not a publisher
						})
					}
				}
			}
			//onSuccess(state);
		}, (error) => {
			// On Error
			console.error(error);
			onError(error);
		})
	}

	Core.User.Logout = function(){
		Core.User.Identifier = "";
		Core.User.Password = "";

		Core.Wallet.wallet = {};
	}

	Core.User.FollowPublisher = function(publisher){
		
	}

	Core.User.UnfollowPublisher = function(publisher){
		
	}

	Core.User.LikeArtifact = function(oip){
		
	}

	Core.User.NeturalArtifact = function(oip){
		
	}

	Core.User.DislikeArtifact = function(oip){
		
	}

	Core.User.UpdateArtifactView = function(oip, last_action, current_duration){

	}

	Core.Wallet = {};

	Core.Wallet.wallet; 
	Core.Wallet.devMode = false;

	Core.Wallet.Login = function(identifier, password, onSuccess, onError){
		Core.Wallet.wallet = new Wallet(identifier, password);

		Core.Wallet.wallet.load().then(() => {
		    return Core.Wallet.wallet.refresh().then((keys) => {
		    		let json = Core.Wallet.wallet.toJSON();
			    	let state = Core.Wallet.keysToState(keys[0], json);

			    	Core.Events.emitter.emit("wallet-bal-update", state);
					onSuccess(state)
				}).catch((error) => {
					onError(error);
				})
			}).catch((error) => {
			onError(error);
		})
	}

	Core.Wallet.refresh = function(){
		Core.Wallet.wallet.refresh().then((keys) => {
			let json = Core.Wallet.wallet.toJSON();
			let state = Core.Wallet.keysToState(keys[0], json);

	    	Core.Events.emitter.emit("wallet-bal-update", state);
		})
	}

	Core.Wallet.sendPayment = function(fiat, amount, payTo, onSuccess, onError){
		// payTo can be an array of addresses, if avaiable. If not, it will only be a string.
		console.log(fiat, amount, payTo, "florincoin");

		Core.Data.getFLOPrice(function(usd_flo){
			console.log(Core.Wallet.wallet);
			
			let paymentAmount = (amount / usd_flo).toFixed(8);
			console.log(paymentAmount)

			if (parseFloat(paymentAmount) <= 0.001)
				paymentAmount = 0.00100001;

			console.log("From: florincoin\nTo: " + payTo + "\nAmount:" + paymentAmount);

			if (Core.Wallet.devMode){
				setTimeout(function(){ onSuccess({"txid": "no-tx-sent___dev-mode"})}, 1500);
			} else {
				var paymentAddress = payTo;

				if (payTo.florincoin)
					paymentAddress = payTo.florincoin;

				Core.Wallet.wallet.payTo("florincoin", paymentAddress, parseFloat(paymentAmount), 0.001, "Hello from oip-mw :)", function(error, success){
					console.log(success,error)
					if (error){
						console.error(error);
						onError(error);
					} else {
						console.log(success);
						onSuccess(success);

						Core.Wallet.refresh();
						Core.Wallet.wallet.store();
					}
				});
			}
		})
	}

	Core.Wallet.keysToState = function(keys, jsonState){
		let state = {};
		for (var j in keys){
			for (var i in keys[j]){
				let coinName = keys[j][i].coinName;

				if (!state[coinName]){
					state[coinName] = {
						balance: 0,
						usd: 0,
						addresses: []
					};
				}

				if (keys[j] && keys[j][i] && keys[j][i].res && keys[j][i].res.balance){
					state[coinName].balance += keys[j][i].res.balance;

					state[coinName].addresses.push({
						address: keys[j][i].res.addrStr,
						balance: keys[j][i].res.balance
					})
				}
			}
		}
		for (var i in jsonState.keys){
			for (var j in jsonState.keys[i].coins){
				let matched = false;
				for (var q in state[j].addresses){
					if (state[j].addresses[q].address === jsonState.keys[i].coins[j].address){
						matched = true;
						state[j].addresses[q].privKey = jsonState.keys[i].coins[j].privKey;
					}
				}
				if (!matched)
					state[j].addresses.push({ address: jsonState.keys[i].coins[j].address, balance: 0, privKey: jsonState.keys[i].coins[j].privKey})
			}
		}

		return state;
	}

	Core.util = {};

	Core.util.chunksToFileURL = function(chunks, onLoad){
		var reader  = new FileReader();

		reader.addEventListener("load", function () {
			if (reader.result && reader.result != "data:"){
				onLoad(reader.result);
			}
		}, false);

		if (chunks) {
			reader.readAsDataURL(new Blob(chunks));
		}
	}

	Core.util.buildIPFSShortURL = function(artifact, file){
		if (!artifact || !file)
			return "";
		
		let location = Core.Artifact.getLocation(artifact);
		return location + "/" + file.fname;
	}

	Core.util.buildIPFSURL = function(hash, fname){
		let trailURL = "";
		if (!fname){
			let parts = hash.split('/');
			if (parts.length == 2){
				trailURL = parts[0] + "/" + encodeURIComponent(parts[1]);
			} else {
				trailURL = hash;
			}
		} else {
			trailURL = hash + "/" + encodeURIComponent(fname);
		}
		return Core.IPFSGatewayURL + trailURL;
	}

	Core.util.getExtension = function(filename){
		let splitFilename = filename.split(".");
		let indexToGrab = splitFilename.length - 1;

		return splitFilename[indexToGrab];
	}

	Core.util.formatDuration = function(intDuration){
		if (!intDuration || isNaN(intDuration))
			return "";

		var sec_num = parseInt(intDuration, 10); // don't forget the second param
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (minutes < 10) {
			if (hours !== 0)
				minutes = "0"+minutes;
		}
		if (seconds < 10) {
			if (minutes !== 0)
				seconds = "0"+seconds;
		}

		if (hours === 0)
			var time = minutes+':'+seconds;
		else
			var time = hours+':'+minutes+':'+seconds;

		return time;
	}

	Core.util.decodeMakeJSONSafe = function(stringToCheck){
		let tmpStr = stringToCheck;
		if (typeof tmpStr === "string" && tmpStr.substr(0,1) === '"' && tmpStr.substr(tmpStr.length-1,tmpStr.length) === '"')
			tmpStr = eval(tmpStr);

		return tmpStr;
	}

	Core.util.createPriceString = function(price){
		// This function assumes the scale has already been applied, and you are passing it a float value
		var priceStr = parseFloat(price.toFixed(3));

		if (isNaN(priceStr)){
			return 0;
		}

		let priceDecimal = priceStr - parseInt(priceStr);

		if (priceDecimal.toString().length === 3){
			priceStr = priceStr.toString() + "0";
		}

		return priceStr.toString();
	}

	Core.util.calculateBTCCost = function(usd_value, callback){
		Core.Data.getBTCPrice(function(btc_price){
			callback(usd_value / btc_price)
		})
	}

	Core.util.convertBTCtoBits = function(btc_value){
		return btc_value * Math.pow(10,6);
	}

	return Core;
})();

export default AlexandriaCore;