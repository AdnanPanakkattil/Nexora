<?php

namespace Modules\ProductManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'categoryName_en' => 'required|string|max:255',
            'categoryName_ar' => 'required|string|max:255',
            'memberPhoto'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'categoryName_en.required' => 'Category Name in English is required.',
            'categoryName_ar.required' => 'Category Name in Arabic is required.',
            'memberPhoto.image'        => 'The file must be an image.',
            'memberPhoto.max'          => 'Image size must not exceed 2MB.',
        ];
    }
}
