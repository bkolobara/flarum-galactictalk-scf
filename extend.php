<?php

use Flarum\Extend;
use Illuminate\Contracts\Events\Dispatcher;
use Bkolobara\GalactictalkSCF\Listener;

return [
  (new Extend\Frontend('forum'))
    ->js(__DIR__.'/js/dist/forum.js')
    ->css(__DIR__.'/css/forum.css'),

  function (Dispatcher $events) {
    $events->subscribe(Listener\AddSCFPostVotesRelationship::class);
  },
];