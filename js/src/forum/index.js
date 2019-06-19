import { extend } from "flarum/extend";

import app from "flarum/app";
import Model from "flarum/Model";
import Post from "flarum/models/Post";
import Discussion from "flarum/models/Discussion";
import icon from "flarum/helpers/icon";
import CommentPost from "flarum/components/CommentPost";

import DiscussionList from "flarum/components/DiscussionList";
import DiscussionListItem from "flarum/components/DiscussionListItem";

app.initializers.add("scf-vote-count", () => {
  // Add eligible votes count to the first post in SCF discussions
  Post.prototype.votes = Model.attribute("votes");
  extend(CommentPost.prototype, "footerItems", function(items) {
    const post = this.props.post;
    const votes = post.votes();

    if (votes !== undefined) {
      items.add(
        "scf-voted",
        <div className="Post-votes">
          <span>Eligible votes: {votes}</span>
        </div>
      );
    }
  });

  // Add eligible votes count to to each discussion in the discussion list.
  Discussion.prototype.votes = Model.attribute("votes");
  extend(DiscussionListItem.prototype, "infoItems", function(items) {
    const discussion = this.props.discussion;
    const votes = discussion.votes();

    if (votes !== undefined) {
      items.add(
        "votes",
        <div className="Discussion-votes">
          {icon("fas fa-poll")}&nbsp;
          <span>Eligible votes: {votes}</span>
        </div>,
        20
      );
    }
  });
});

app.initializers.add("extended-view-of-scf-tag-page", () => {
  extend(DiscussionList.prototype, "requestParams", function(params) {
    if (this.props.params.tags && this.props.params.tags === "SCF") {
      // Show 50 results only on the SCF tag
      Object.defineProperty(params, "_page", {
        value: { size: 50 },
        writable: true,
        enumerable: false
      });

      Object.defineProperty(params, "page", {
        get: function() {
          return this._page;
        },
        set: function(newPage) {
          Object.assign(this._page, newPage);
        },
        enumerable: true
      });
    }
  });
});
