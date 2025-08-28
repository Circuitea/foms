<?php

namespace App\Rules;

use App\Models\Section;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidSection implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        foreach ($value as $sectionID) {
            if (Section::where('id', $sectionID)->doesntExist()) {
                $fail('The :attribute contains an invalid Section ID');
            }
        }
    }
}
