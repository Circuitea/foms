<?php

namespace App\Http\Requests;

use App\Models\Personnel;
use App\Models\Role;
use App\Models\Section;
use App\Rules\ValidRole;
use App\Rules\ValidSection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;


class NewPersonnelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $roleIDs = Role::all(['id'])->pluck('id')->toArray();
        $sectionIDs = Section::all(['id'])->pluck('id')->toArray();

        return [
            'surname' => 'required|string|alpha|max:255',
            'first_name' => 'required|string|alpha|max:255',
            'middle_name' => 'nullable|string|alpha|max:255',
            'name_extension' => 'nullable|string|alpha|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.Personnel::class,
            'mobile_number' => 'nullable|string|size:10',
            'roles' => ['required', 'list', new ValidRole],
            'sections' => ['required', 'list', new ValidSection],
            'password' => ['required', Rules\Password::defaults()],
        ];
    }
}
