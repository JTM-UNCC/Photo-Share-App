parseMarkup = (commentMarkup) => {
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

}

parseMarkup("Hi @!{([838443])}[(user:matt)]!@ how are you? my friend is @!{([99321])}[(user:joe)]!@ he says hi ", 1);