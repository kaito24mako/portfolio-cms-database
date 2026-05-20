    async postPresident(req, res) {
    	try {
    		//* We can define what params/fields/attributes we accept as a request.
    		//* So if it makes more sense for the User to provide us the clubName than the ClubId:
    		//? We can simply manipulate our code to find the clubName associated, even though our FK is ClubId.
    		//! If we explicitly ask for it, the User should provided it.
    		if (!req.body.clubName) {
    			return res.status(400).send("Please include Club's name!");
    		}

    		const club = await Club.findOne({ where: { name: req.body.clubName } });
    		if (!club) {
    			return res.status(404).send("No Club found!");
    		}

    		//* findOrCreate({where:{...}}) is considered for finding the instance.
    		//* So in this DB, we can create a President, as long as the associated Club doesn't already have one.
    		//? So created === 0 if a Presidents ClubId matches club.id
    		const [president, created] = await President.findOrCreate({
    			where: { ClubId: club.id },
    			defaults: {
    				firstName: req.body.firstName,
    				lastName: req.body.lastName,
    				ClubId: club.id,
    			},
    		});
    		if (!created) {
    			//! 409 = Conflict with DB
    			return res
    				.status(409)
    				.send("A President already exists for this Club!");
    		}
    		console.log("President Created:", president);
    		res.json(president);
    	} catch (error) {
    		internalError(error, res);
    	}
    },
