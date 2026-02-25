<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class BackgroundCheckComment extends Model
{
  use HasFactory;

  protected $fillable = [
    'author_id',
    'email',
    'comment',
  ];

  /**
  * Get the author of the comment.
  */
  public function author()
  {
    return $this->belongsTo(User::class, 'author_id');
  }

  static function enhanceBackgroundCheckComment($comment){
    $comment['timestamp'] = \Carbon\Carbon::parse($comment['created_at']);
    return $comment;
  }

  static function getByEmail($email){
    $collection = BackgroundCheckComment::where('email', $email)->get();
    $enhancedCollection = array_map(function ($aResultItem) {
      return self::enhanceBackgroundCheckComment($aResultItem);
    }, $collection->toArray());

    return $enhancedCollection;
  }

  static function addComment($attributes): BackgroundCheckComment {
    $comment = new BackgroundCheckComment([
      'author_id' => isset($attributes['user_id'])
        ? $attributes['user_id']
        : auth()->user()->id
      , 'email' => $attributes['email']
      , 'comment' => $attributes['comment']
    ]);
    $comment->save();
    $enhancedComment = self::enhanceBackgroundCheckComment($comment);

    return $enhancedComment;
  }
}
