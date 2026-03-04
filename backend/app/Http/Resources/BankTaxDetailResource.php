<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BankTaxDetailResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'                 => $this->id,
            'user_id'            => $this->user_id,
            'user_name'          => $this->user?->name,
            'user_email'         => $this->user?->email,
            'bank_name'          => $this->bank_name,
            'masked_account'     => $this->masked_account,
            'sort_code'          => $this->sort_code,
            'tax_code'           => $this->tax_code,
            'national_insurance' => $this->national_insurance,
            'created_at'         => $this->created_at?->toDateTimeString(),
            'updated_at'         => $this->updated_at?->toDateTimeString(),
        ];
    }
}
