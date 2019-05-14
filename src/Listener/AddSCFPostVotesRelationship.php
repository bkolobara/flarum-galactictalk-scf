<?php

namespace Bkolobara\GalactictalkSCF\Listener;

use Carbon\Carbon;
use Illuminate\Contracts\Events\Dispatcher;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\PostSerializer;

class AddSCFPostVotesRelationship {
  public function subscribe(Dispatcher $events)
  {
    $events->listen(Serializing::class, [$this, 'addVoteCountToPostSerializer']);
  }

  public function addVoteCountToPostSerializer(Serializing $event)
  {
    if ($event->isSerializer(PostSerializer::class)) {
      $first = $event->model->discussion->first_post_id == $event->model->id;
      $scf_tag = $event->model->discussion->tags->contains('slug', 'SCF');
      $likes_enabled = $event->model->likes;
      if ($first && $scf_tag && $likes_enabled) {
        $date_limit = new Carbon('first day of March 2019');
        $eligible_voters = $event->model->likes->filter(function ($user, $key) use ($date_limit) {
          return $date_limit->greaterThan($user->joined_at);
        });
        
        $event->attributes['votes'] = $eligible_voters->count();
      }
    }
  }
}