<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'department'  => $this->department?->name,
            'location'    => $this->location,
            'type'        => $this->type,
            'applicants'  => $this->applicants,
            'status'      => $this->status,
            'description' => $this->description,
            'posted_at'   => $this->posted_at->format('M d, Y'),
        ];
    }
}
