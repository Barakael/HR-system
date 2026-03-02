<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TrainingProgramResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'category'    => $this->category,
            'instructor'  => $this->instructor,
            'duration'    => $this->duration,
            'enrolled'    => $this->enrollments()->count(),
            'status'      => $this->status,
            'description' => $this->description,
            // For employee: their own enrollment pivot data
            'my_progress' => $this->whenPivotLoaded('training_enrollments', fn() => $this->pivot->progress),
            'my_status'   => $this->whenPivotLoaded('training_enrollments', fn() => $this->pivot->status),
        ];
    }
}
