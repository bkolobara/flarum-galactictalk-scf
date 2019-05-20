import { extend } from "flarum/extend";
import app from "flarum/app";
import Model from "flarum/Model";
import Post from "flarum/models/Post";
import CommentPost from "flarum/components/CommentPost";
import icon from "flarum/helpers/icon";

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
