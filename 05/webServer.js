/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");


const fs = require("fs");
const async = require("async");

const express = require("express");
const app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");
const Activity = require("./schema/activity.js");
//const Activity = require('./schema/activity.js');
const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');
const commentSchema = require("./schema/comment.js");
const Comment = mongoose.model("Comment", commentSchema);
app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
//const models = require("./modelData/photoApp.js").models;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));
const crypto = require("./password.js");


function getSessionUserID(request) {
    return request.session.user_id;
    //return session.user._id;
}

function hasNoUserSession(request, response) {
    //return false;
    if (!getSessionUserID(request)) {
        response.status(401).send();
        return true;
    }
    // if (session.user === undefined){
    //   response.status(401).send();
    //   return true;
    // }
    return false;
}

app.get("/", function (request, response) {
    response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 *
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params
    // objects.
    console.log("/test called with param1 = ", request.params.p1);

    const param = request.params.p1 || "info";

    if (param === "info") {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will
        // match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error. We pass it back to the browser with an
                // Internal Service Error (500) error code.
                console.error("Error in /user/info:", err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object -
                // This is also an internal error return.
                response.status(500).send("Missing SchemaInfo");
                return;
            }

            // We got the object - return it in JSON format.
            console.log("SchemaInfo", info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === "counts") {
        // In order to return the counts of all the collections we need to do an
        // async call to each collections. That is tricky to do so we use the async
        // package do the work. We put the collections into array and use async.each
        // to do each .count() query.
        const collections = [
            {name: "user", collection: User},
            {name: "photo", collection: Photo},
            {name: "schemaInfo", collection: SchemaInfo},
        ];
        async.each(
            collections,
            function (col, done_callback) {
                col.collection.countDocuments({}, function (err, count) {
                    col.count = count;
                    done_callback(err);
                });
            },
            function (err) {
                if (err) {
                    response.status(500).send(JSON.stringify(err));
                } else {
                    const obj = {};
                    for (let i = 0; i < collections.length; i++) {
                        obj[collections[i].name] = collections[i].count;
                    }
                    response.end(JSON.stringify(obj));
                }
            }
        );
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400)
        // status.
        response.status(400).send("Bad param " + param);
    }
});

app.get('/activities', function (request, response) {
    console.log("Express/activities | Called");
    if (hasNoUserSession(request, response)) return;

    let query = Activity.find({}).sort("-date_time").limit(5);
    query.exec(function(err, activities) {
        if(err) {
            console.error("Express/activities | Error in Mongo call: " + err);
            response.status(400).send();
            
        } else {
            console.log('Express/activities | Status 200.');
            response.status(200).send(JSON.stringify(activities));
            
        }
    });
});

function isValidSession(req, res) {
    if (!req.session.user_id) {
        res.status(401).send();
        return false;
    }
    // if (session.user === undefined){
    //   response.status(401).send();
    //   return true;
    // }
    return true;
}

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", function (request, response) {
    if (!isValidSession(request, response)) {
        return;
    }
    User.find({}, "_id first_name last_name").then(function (info, err) {

        if (err) {
            console.error("Error in user/list", err);
            response.status(500).send(JSON.stringify(err));
            return;
        } else if (info.length === 0) {
            response.status(500).send("Missing user list");
            return;
        }

        response.status(200).send(JSON.stringify(info));
    });
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", function (request, response) {
    if (!isValidSession(request, response)) {
        return;
    }
    const id = request.params.id;
    User.findOne({_id: id}, "_id first_name last_name location description occupation")
        .then(function (user) {
            if (!user) {
                console.log("User with _id:" + id + " not found.");
                response.status(400).send("Not found");
                return;
            }
            response.status(200).send(JSON.stringify(user));
        }).catch(error => response.status(400).send(JSON.stringify(error)));


});
// Here - add photo functionality

/**
 * URL /photos/new - adds a new photo for the current user
 */
app.post("/photos/new", function (request, response) {
    if (hasNoUserSession(request, response)) return;
    const user_id = getSessionUserID(request) || "";
    if (user_id === "") {
        console.error("Error in /photos/new", user_id);
        response.status(400).send("user_id required");
        return;
    }
    processFormBody(request, response, function (err) {
        if (err || !request.file) {
            console.error("Error in /photos/new", err);
            response.status(400).send("photo required");
            return;
        }
        const timestamp = new Date().valueOf();
        const filename = 'U' + String(timestamp) + request.file.originalname;
        fs.writeFile("./images/" + filename, request.file.buffer, function (err2) {
            if (err2) {
                console.error("Error in /photos/new", err2);
                response.status(400).send("error writing photo");
                return;
            }
            Photo.create(
                {
                    _id: new mongoose.Types.ObjectId(),
                    file_name: filename,
                    date_time: new Date(),
                    user_id: new mongoose.Types.ObjectId(user_id),
                    comment: []
                })
                .then(() => {
                    response.end();
                })
                .catch(err3 => {
                    console.error("Error in /photos/new", err3);
                    response.status(500).send(JSON.stringify(err3));
                });
        });
    });
});


/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", function (request, response) {
    if (!isValidSession(request, response)) {
        return;
    }
    const id = request.params.id;
    let user__id;
    try {
        user__id = new mongoose.Types.ObjectId(id);
    } catch(e){
        response.status(400).send(JSON.stringify(e));
        return;
    }
    Photo.aggregate([
        {
            $match:
                {user_id: {$eq: user__id}}
        },
        {
            $addFields: {
                comments: {$ifNull: ["$comments", []]}
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "comments.user_id",
                foreignField: "_id",
                as: "users"
            }
        },
        {
            $addFields: {
                comments: {
                    $map: {
                        input: "$comments",
                        in: {
                            $mergeObjects: [
                                "$$this",
                                {
                                    user: {
                                        $arrayElemAt: [
                                            "$users",
                                            {
                                                $indexOfArray: [
                                                    "$users._id",
                                                    "$$this.user_id"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $project: {
                users: 0,
                __v: 0,
                "comments.__v": 0,
                "comments.user_id": 0,
                "comments.user.location": 0,
                "comments.user.description": 0,
                "comments.user.occupation": 0,
                "comments.user.__v": 0
            }
        }
    ]).then(function (photos) {
        if (photos.length === 0 || !photos) {
            // Query didn't return an error but didn't find the SchemaInfo object -
            // This is also an internal error return.
            response.status(400).send("length===0");
            return;
        }
        //deleting unnecessary values
        photos.map(value => {
            return value.comments.map(comment => {
                delete comment.user.login_name;
                delete comment.user.password_digest;
                delete comment.user.salt;
                return comment;
            });
        });
        // We got the object - return it in JSON format.
        response.end(JSON.stringify(photos));
    }).catch(error => response.status(400).send(JSON.stringify(error)));
});

// here - delete comment functionality
app.delete("/comment/:photo_id/:comment_id", function (request, response) {

    if (hasNoUserSession(request, response)) return;
    const photo_id = request.params.photo_id || "";
    const comment_id = request.params.comment_id || "";
    if (photo_id === "" || comment_id === "") {
        response.status(400).send("ids required");
        return;
    }


    Photo.findOneAndUpdate(
        {_id: photo_id},
        {$pull: {comments: {_id: comment_id}}},
        {new: true},
        (err, photo)=>{
            if (err){
                response.status(400).send("error");
            }
            else if (!photo){
                response.status(400).send("photo doesn't exist");
            }
            else {
                response.status(204).send("deleted");
            }
        }
    );

});

app.delete("/photo/:user_id/:photo_id", function (request, response) {

    if (hasNoUserSession(request, response)) return;
    const photo_id = request.params.photo_id || "";
    const user_id = request.params.user_id || "";
    if (photo_id === "" || user_id === "") {
        response.status(400).send("ids required");
        return;
    }
    if (user_id !== getSessionUserID(request)){
        response.status(401).send("unauthorized delete");
    }

    Photo.findOneAndDelete(
        {_id: photo_id},
        undefined,
        (err, photo)=>{
            if (err){
                response.status(400).send(JSON.stringify(err));
            }
            else if (!photo){
                response.status(400).send("photo doesn't exist");
            }
            else {
                response.status(204).send("deleted");
            }
        }
    );

});

const parseMarkup = (commentMarkup) => {
    let comment = commentMarkup;

    let mentions = [];
    //markup = "@!{([__id__])}[(user:__display__)]!@"

    comment = comment.split("@!{([");
    for (let k = 1; k < comment.length; k++) {

        let temp = comment[k].split("])}[(user:");

        comment[k] = temp[1];
        mentions.push(temp[0]);
    }

    comment = comment.join("@");

    comment = comment.split(")]!@").join("");

    console.info(comment, mentions);

    return { comment: comment, mentions: mentions };

};

app.delete("/user/:user_id", function (request, response) {

    if (hasNoUserSession(request)) return;
    const user_id = request.params.user_id || "";
    if (user_id === "") {
        response.status(400).send("ids required");
        return;
    }
    if (user_id !== getSessionUserID(request)){
        response.status(401).send("Invalid user id");
    }
    request.session.destroy(() => {
        session.user_id = undefined;
    });

    User.findOneAndDelete(
        { _id: user_id }
    ).then(() => {
        Photo.deleteMany({ user_id: user_id })
            .then( () => {
                Comment.deleteMany({ user_id: user_id })
                    .then(() => response.status(204).send("deleted successfully"))
                    .catch(err => console.log(err));
            }).catch(err => console.log(err));
    }).catch(err => console.log(err));

});


app.post("/commentsOfPhoto/:photo_id", async function (request, response) {
    if (hasNoUserSession(request, response)) return;
    const mentionNum = request.body.mentions;

    let { comment, mentions } = (mentionNum > 0) ?
        parseMarkup(request.body.comment)
        : { comment: request.body.comment || "", mentions: undefined};

    console.log(comment + "COMMENTT");

    const id = request.params.photo_id || "";
    const user_id = getSessionUserID(request) || "";

    if (id === "") {
        response.status(400).send("id required");
        return;
    }
    if (user_id === "") {
        response.status(400).send("user_id required");
        return;
    }
    if (comment === "") {
        response.status(400).send("comment required");
        return;
    }
    if(mentions?.length > 0){
        console.info("checking mentions");
        console.info(mentions);
        let temp = [];
        let queries = [];
        for (let mention of mentions){
            queries.push(User.findOne({ _id: mention }, "_id")
                .then(user => {
                    if (user) temp.push(user);
                    console.warn("user found: " + user);
                }).catch(error => console.log(error)));
        }
        await Promise.allSettled(queries).then(() => {
            mentions = temp;
        });
        console.log("mentions:" + mentions);
    }
    console.log("Mentions, right before update:" + mentions);
    Photo.updateOne(
        {_id: new mongoose.Types.ObjectId(id)},
        {
            $push: {
                comments: {
                    comment: comment,
                    date_time: new Date(),
                    user_id: new mongoose.Types.ObjectId(user_id),
                    _id: new mongoose.Types.ObjectId(),
                    mentioned_users: mentions || undefined
                }
            }
        },
         function (err) {
            if (err) {
                // Query returned an error. We pass it back to the browser with an
                // Internal Service Error (500) error code.
                console.error("Error in /commentsOfPhoto/:photo_id", err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            response.end();
        });
});

app.get("/mentions/user/:userId", function(request, response){
    if (hasNoUserSession(request, response)) return;

    let user_id = request.params.userId;

    Photo.find({ "comments.mentioned_users": user_id }, "file_name user_id comments date_time")
        .sort("-date_time")
        .then(async photos =>{
            if (!photos || photos.length === 0){
                response.status(400).send("no mentions found");
                return;
            }
            let queries = [];
            let finalPhotos = [];
            photos.map(photo => {
                return queries.push(User.findOne({ _id: photo.user_id }, "first_name last_name _id")
                    .then(user => {
                        photo = photo.toObject();
                        photo.user = user;
                        finalPhotos.push(photo);
                    }).catch(err => console.log(err)));
            });
            await Promise.allSettled(queries).then(() => {
                console.log(finalPhotos);
                response.status(200).send(JSON.stringify(finalPhotos));
            });

        }).catch(err => response.status(400).send(err));

});

app.get("/photosOfUser/:userId/previews", function(request, response){
    if (hasNoUserSession(request, response)) return;

    const user_id = request.params.userId || "";
    Photo.find({ user_id: user_id })
        .sort("-date_time")
        .then(photos => {
            if (!photos || photos.length === 0){
                response.status(400).send("No photos");
            }
            else {
                let maxComments = 0;
                let maxCommentsIndex = 0;
                for (let i = 0; i < photos.length; i++) {
                    if (photos[i].comments?.length > maxComments) {
                        maxComments = photos[i].comments.length;
                        maxCommentsIndex = i;
                    }
                }

                response.status(200)
                    .send(JSON.stringify({ recent: photos[0], mostComments: photos[maxCommentsIndex] }));
            }

        });


});

app.post("/admin/login", function (request, response) {


    User.findOne({
        login_name: request.body.login_name
    }, "_id login_name first_name last_name location occupation description salt password_digest")
        .then(function (user) {
            // console.log(user);
            if (!user) {


                response.status(400).send("Invalid login");

            } else if (crypto.doesPasswordMatch(user.password_digest, user.salt, request.body.password)) {

                user = user.toObject();
                // console.log(`${user.salt}, ${user.password_digest}`);
                delete user.salt;
                delete user.password_digest;
                request.session.login_name = request.body.login_name;
                request.session.user_id = user._id;
                session.user_id = user._id;

                response.status(200).send(JSON.stringify(user));
            }
            else response.status(400).send("Invalid login");
        }).catch(error => response.status(400).send(JSON.stringify(error)));
});

app.post("/admin/logout", function (request, response) {
    if (request.session.user_id) {
        request.session.destroy(() => {
            session.user_id = undefined;
            response.end();
        });

    } else response.status(400).send("Not logged in");
});

app.post("/auth", function (request, response) {
    console.log(`Request received: ${request}`);
    User.findOne({ login_name: request.session.login_name },
        "_id login_name first_name last_name occupation description location")
        .then((user) => {
            if (user != null){
                response.status(200).send(JSON.stringify(user));
            }
    }).catch(err => {
        response.status(401).send("Not authenticated" + err);
    });


});

app.post("/user", function (request, response) {
    if (!request.body.login_name || !request.body.first_name || !request.body.last_name || !request.body.password) {
        response.status(400).send("Missing necessary value");
        return;
    }
    User.findOne({login_name: request.body.login_name}, "login_name")
        .then(function (user) {
            if (user) {
                response.status(400).send(`User ${request.body.login_name} already exists`);

            } else {
                const hash = crypto.makePasswordEntry(request.body.password);

                User.create({
                    _id: new mongoose.Types.ObjectId(),
                    first_name: request.body.first_name,
                    last_name: request.body.last_name,
                    password_digest: hash.hash,
                    salt: hash.salt,
                    login_name: request.body.login_name,
                    location: request.body.location || undefined,
                    occupation: request.body.occupation || undefined,
                    description: request.body.description || undefined
                }).then(user2 => {
                    request.session.login_name = user2.login_name;
                    request.session.user_id = user2._id;
                    session.user_id = user2._id;
                    response.status(200).send(JSON.stringify(user2));
                }).catch(error => {
                    response.status(400).send(error);
                });
            }
        });
});

app.get("/mentions/users/list", function(request, response){
    if (hasNoUserSession(request, response)) return;

    User.find( {}, "login_name _id")
        .then(users => {
            let userList = new Array(users.length);
            for (let i = 0; i < users.length; i++){
                const id = users[i]._id;
                const display = users[i].login_name;
                userList[i] = { id: id, display: display };
            }
        response.status(200).send(JSON.stringify(userList));
    }).catch(error => {
        console.error(error);
        response.status(500).send(JSON.stringify(error));
    });
});

const server = app.listen(3000, function () {
    const port = server.address().port;
    console.log(
        "Listening at http://localhost:" +
        port +
        " exporting the directory " +
        __dirname
    );
});
