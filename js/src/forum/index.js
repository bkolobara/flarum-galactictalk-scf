import { extend } from "flarum/extend";

import app from "flarum/app";
import Model from "flarum/Model";
import Post from "flarum/models/Post";
import Discussion from "flarum/models/Discussion";
import icon from "flarum/helpers/icon";
import CommentPost from "flarum/components/CommentPost";

import IndexPage from "flarum/components/IndexPage";
import DiscussionList from "flarum/components/DiscussionList";
import ScorePage from "./ScorePage";

import Tag from "flarum/tags/models/Tag";
import DiscussionTaggedPost from "flarum/tags/components/DiscussionTaggedPost";
import addTagList from "flarum/tags/addTagList";
import addTagFilter from "flarum/tags/addTagFilter";
import addTagLabels from "flarum/tags/addTagLabels";
import addTagControl from "flarum/tags/addTagControl";
import addTagComposer from "flarum/tags/addTagComposer";

app.initializers.add("scf-vote-count", () => {
  Post.prototype.votes = Model.attribute("votes");
  Post.prototype.likes = Model.hasMany("likes");

  extend(CommentPost.prototype, "footerItems", function(items) {
    const post = this.props.post;
    const votes = post.votes();

    if (votes !== undefined) {
      items.add(
        "scf-voted",
        <div className="Post-votes">
          {icon("fas fa-poll")}
          <span>Eligible votes: {votes}</span>
        </div>
      );
    }
  });
});

app.initializers.add("view-of-scf-tag-page", () => {
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

  // app.routes.scf = {
  //   path: "/t/SCF",
  //   component: ScorePage.component({ tags: "SCF" })
  // };
  // app.postComponents.discussionTagged = DiscussionTaggedPost;
  // app.store.models.tags = Tag;
  // // As we are changing a foundamental page we need to hack a bit around
  // const tempIndexPagePrototype = IndexPage.prototype;
  // IndexPage.prototype = ScorePage.prototype;
  // addTagList();
  // addTagFilter();
  // addTagLabels();
  // addTagControl();
  // addTagComposer();
  // IndexPage.prototype = tempIndexPagePrototype;
});
