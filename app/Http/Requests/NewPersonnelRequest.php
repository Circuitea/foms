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
use Illuminate\Validation\Rules\File;

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
        return [
            'surname' => 'required|string|regex:/^[A-Za-z\\s]+$/|max:255',
            'first_name' => 'required|string|regex:/^[A-Za-z\\s]+$/|max:255',
            'middle_name' => 'nullable|string|regex:/^[A-Za-z\\s]+$/|max:255',
            'name_extension' => 'nullable|string|regex:/^[A-Za-z\\s]+$/|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.Personnel::class,
            'mobile_number' => 'nullable|string|size:10',
            'roles' => ['required', 'list'],
            'sections' => ['required', 'list', new ValidSection],
            'password' => ['required', Rules\Password::defaults()],
            'profile_picture' => ['nullable', File::image()->max('100mb')],
        ];
    }

    public function messages()
    {
        return [
            'first_name.regex' => 'The :attribute must only contain alphabetic characters and/or a whitespace',
            'middle_name.regex' => 'The :attribute must only contain alphabetic characters and/or a whitespace',
            'surname.regex' => 'The :attribute must only contain alphabetic characters and/or a whitespace',
            'name_extension.regex' => 'The :attribute must only contain alphabetic characters and/or a whitespace',
        ];
    }
}
