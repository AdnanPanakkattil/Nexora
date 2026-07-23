<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaFile extends Model
{
    use HasFactory;

    protected $table = 'media_files';

    protected $fillable = [
        'static_key',
        'file_path',
        'file_name',
        'mime_type',
        'file_size',
        'model_type',
        'model_id',
    ];

    /**
     * Get full public asset URL for the stored media file.
     */
    public function getUrlAttribute()
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }

    /**
     * Polymorphic relation to parent model.
     */
    public function model()
    {
        return $this->morphTo();
    }
}
