/*
	Medicine: {
		merchant: s,
	    country: s,
        institute: s,
        scientist: s,
        domain: s,
        name: s,
        category: s,
        target: s,
        indication: s,
        preclinical_study: s,
        clinical_declaration: s,
        clinical_approval: dt,
        clinical_trial_no: s,
        clinical_1_study: s,
        clinical_2_study: s,
        clinical_3_study: s,
        listing_application: dt,
        listing_approval: dt,
        state: n,
        sales: n,
	},

*/

import Model from './Model'

export default class Medicine extends Model {
    constructor(attrs){
        super("Medicine", attrs);

        this.defineRWAttrs([
            "medicine", "country", "institute", "scientist", "domain", "name", "category", 
            "target", "indication",
            "preclinical_study", 
            "clinical_declaration", "clinical_approval", "clinical_trial_no", "clinical_1_study", "clinical_2_study", "clinical_3_study",
            "listing_application", "listing_approval", 
            "state", "sales"
        ]);
    }

    get stateName() {
        return ['临床前研究', '临床申报', '临床I期研究', '临床II期研究', '临床III期研究', '上市申请', '销售'][this.state]
    }
}