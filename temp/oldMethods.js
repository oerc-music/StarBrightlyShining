
labelForPlace(place, language){
  if (!place || !(pref.schema+"about" in place)) return place;

  const name = place[pref.schema+"about"][pref.schema+"name"];
  if ( Array.isArray(name) && name.length > 1 ){
    return name.find(x => ["@language"]) === language["@value"];
  } else if ( Array.isArray(name)){
    return name[0]["@value"];
  } else {
    console.log("msg3: place is not what we expected", name);
    return "";
  }
}
	transformArrangement(vivoScore){
		// Take graph of arrangement and make more intuitive local object
		let obj = {};
		obj.shortTitle = vivoScore[pref.bibo+"shortTitle"];
//		obj.genre = pref.dbpedia+"genre" in vivoScore ? vivoScore[pref.dbpedia+"genre"]['@id'] : false;
//    obj.genre = this.labelForGenre(vivoScore[pref.dbpedia+"genre"], "en");
//    obj.genre = vivoScore[pref.dbpedia+"genre"][pref.schema+"about"][pref.schema+"name"][0]['@value'];
//    obj.genre = vivoScore[pref.dbpedia+"genre"][pref.schema+"about"][pref.schema+"name"];
        obj.genre = vivoScore[pref.dbpedia+"genre"][pref.schema+"about"][pref.schema+"name"];
//    obj.genre = this.getText(vivoScore[pref.dbpedia+"genre"][pref.schema+"about"], "en");
//    obj.genre = this.labelForGenre(vivoScore[pref.dbpedia+"genre"], "en");
		obj.arranger = vivoScore[pref.gndo+'arranger']; // Change so we have name, not URL
		obj.publisher = vivoScore[pref.dce+"publisher"]; // Change so we have name, not URL
		obj.date = vivoScore[pref.gndo+"dateOfPublication"];
		obj.MEI = pref.frbr+"embodiment" in vivoScore ? vivoScore[pref.frbr+"embodiment"]['@id'] : false;
//		obj.place = vivoScore[pref.rdau+"P60163"][pref.schema+"about"][pref.schema+"name"][0]['@value'];
    obj.place = this.labelForPlace(vivoScore[pref.rdau+"P60163"][pref.schema+"about"][pref.schema+"name"], "en");
//    obj.catNumber = pref.wdt+"P217" in vivoScore ? vivoScore[pref.wdt+"P217"]['@id'] : false;
    obj.catNumber = vivoScore[pref.wdt+"P217"];
		obj.work = vivoScore[pref.rdau+"P60242"];
		console.log("Processed a ", vivoScore, " into a ", obj);
		return obj;
	}
