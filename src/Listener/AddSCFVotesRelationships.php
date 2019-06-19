<?php

namespace Bkolobara\GalactictalkSCF\Listener;

use Carbon\Carbon;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Api\Serializer\DiscussionSerializer;

class AddSCFVotesRelationships {
  public function subscribe(Dispatcher $events)
  {
    $events->listen(Serializing::class, [$this, 'addVoteCountToPostSerializer']);
    $events->listen(Serializing::class, [$this, 'addVoteCountToDiscussionSerializer']);
  }

  public function addVoteCountToPostSerializer(Serializing $event)
  {
    if ($event->isSerializer(PostSerializer::class)
        && $this->isSCFVotingPost($event->model->discussion, $event->model)) {
      $event->attributes['votes'] = $this->eligibleVoteCount($event->model);
    }
  }

  public function addVoteCountToDiscussionSerializer(Serializing $event)
  {
    if ($event->isSerializer(DiscussionSerializer::class)
        && !$event->model->is_sticky
        && $event->model->tags->contains('slug', 'SCF')) {
      $first_post = $event->model->posts[0];
      if (is_object($first_post) && $this->isSCFVotingPost($event->model, $first_post)) {
        $event->attributes['votes'] = $this->eligibleVoteCount($first_post);
      }
    }
  }

  /**
   * Returns the number of eligible votes.
   * 
   * @param $post
   * @return int
   */
  private function eligibleVoteCount($post)
  {
    $date_limit = new Carbon('last day of March 2019');
    $now = Carbon::now();
    // Don't count accounts that joined after March or that are suspended.
    $eligible_voters = $post->likes->filter(function ($user, $key) use ($date_limit, $now, $post) {
      return $date_limit->greaterThan($user->joined_at)
             && $now->greaterThan($user->suspended_until)
             && $post->user->id !== $user->id; // Don't count self likes
    });
    
    return $eligible_voters->count();
  }

  /**
   * Only first posts, in not sickyed discussions under the SCF tag are voting posts.
   * 
   * @param $discussion
   * @param $post
   * @return bool
   */
  private function isSCFVotingPost($discussion, $post)
  {
    $sticky = $discussion->is_sticky;
    $first = $discussion->first_post_id == $post->id;
    $scf_tag = $discussion->tags->contains('slug', 'SCF');
    $likes_enabled = $post->likes;
    return !$sticky && $first && $scf_tag && $likes_enabled;
  }
}