module.exports =
class ArtifactFile {
	constructor(){
		this.file = {}
	}
	setFilename(filename){
		this.file.fname = filename;
	}
	getFilename(){
		return this.file.fname
	}
	setDisplayName(displayName){
		this.file.dname = displayName;
	}
	getDisplayName(){
		if (!this.file.dname || this.file.dname === ""){
			return this.getFilename()
		}
		
		return this.file.dname;
	}
	setDuration(seconds){
		if (isNaN(seconds))
			return

		this.file.duration = seconds;
	}
	getDuration(){
		return this.file.duration
	}
	setType(type){
		this.file.type = this.capitalizeFirstLetter(type);
	}
	getType(){
		return this.file.type
	}
	setSubtype(subtype){
		if (subtype === "cover"){
			subtype = "Thumbnail"
		}

		this.file.subtype = this.capitalizeFirstLetter(subtype);
	}
	getSubtype(){
		return this.file.subtype
	}
	setFilesize(filesize){
		this.file.fsize = filesize;
	}
	getFilesize(){
		return this.file.fsize
	}
	setContentType(contentType){
		this.file.ctype = contentType;
	}
	getContentType(){
		return this.file.ctype
	}
	setFileNotes(notes){
		this.file.fnotes = notes;
	}
	getFileNotes(){
		return this.file.fnotes;
	}
	setSoftware(software){
		this.file.software = software;
	}
	getSoftware(){
		return this.file.software
	}
	setNetwork(network){
		this.file.network = network;
	}
	getNetwork(){
		return this.file.network
	}
	setLocation(loc){
		this.file.location = loc;
	}
	getLocation(){
		return this.file.location
	}
	setSuggestedPlayCost(suggestedPlayCostFiat){
		this.file.sugPlay = suggestedPlayCostFiat
	}
	getSuggestedPlayCost(){
		return this.file.sugPlay
	}
	setSuggestedBuyCost(suggestedBuyCostFiat){
		this.file.sugBuy = suggestedBuyCostFiat
	}
	getSuggestedBuyCost(){
		return this.file.sugBuy
	}
	setDisallowPlay(disallowPlay){
		this.file.disPlay = disallowPlay
	}
	getDisallowPlay(){
		return this.file.disPlay || false
	}
	setDisallowBuy(disallowBuy){
		this.file.disBuy = disallowBuy
	}
	getDisallowBuy(){
		return this.file.disBuy || false
	}
	isValid(){
		if (!this.file.fname){
			return {success: false, error: "No Filename!"}
		}
		return true;
	}
	isPaid(){
		let paid = false;

		if (this.file.sugPlay){
			paid = true;
		}
		if (this.file.sugBuy){
			paid = true;
		}

		return paid;
	}
	toJSON(){
		return JSON.parse(JSON.stringify(this.file))
	}
	fromJSON(fileObj){
		if (fileObj){
			if (fileObj.fname){
				this.setFilename(fileObj.fname)
			}
			if (fileObj.dname){
				this.setDisplayName(fileObj.dname)
			}
			if (fileObj.fsize){
				this.setFilesize(fileObj.fsize)
			}
			if (fileObj.duration){
				this.setDuration(fileObj.duration)
			}
			if (fileObj.type){
				this.setType(fileObj.type)
			}
			if (fileObj.subtype){
				this.setSubtype(fileObj.subtype)
			}
			if (fileObj.network){
				this.setNetwork(fileObj.network)
			}
			if (fileObj.location){
				this.setLocation(fileObj.location)
			}
			if (fileObj.cType){
				this.setContentType(fileObj.cType)
			}
			if (fileObj.ctype){
				this.setContentType(fileObj.ctype)
			}
			if (fileObj.fNotes){
				this.setFileNotes(fileObj.fNotes)
			}
			if (fileObj.fnotes){
				this.setFileNotes(fileObj.fnotes)
			}
			if (fileObj.software){
				this.setSoftware(fileObj.software)
			}
			if (fileObj.disPlay){
				this.setDisallowPlay(fileObj.disPlay)
			}
			if (fileObj.disBuy){
				this.setDisallowBuy(fileObj.disBuy)
			}
			if (fileObj.sugPlay){
				this.setSuggestedPlayCost(fileObj.sugPlay)
			}
			if (fileObj.sugBuy){
				this.setSuggestedBuyCost(fileObj.sugBuy)
			}
		}
	}
	capitalizeFirstLetter(string){
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	}
}