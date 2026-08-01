<?php

namespace Modules\ProductManagement\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ChildCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules for creating/updating a Child Category.
     *
     * Input fields received from form data:
     * - sub_category_id: ID of the selected parent Sub Category
     * - childCategoryName_en: English name of the Child Category
     * - childCategoryName_ar: Arabic name of the Child Category
     * - memberPhoto: Image file uploaded for the Child Category
     */
    public function rules(): array
    {
        return [
            'sub_category_id'      => 'required|exists:sub_categories,id', // Parent sub category ID must exist in sub_categories table
            'childCategoryName_en' => 'required|string|max:255',           // English name input string
            'childCategoryName_ar' => 'required|string|max:255',           // Arabic name input string
            'memberPhoto'          => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Image upload file validation
        ];
    }

    /**
     * Custom error messages returned when validation fails.
     */
    public function messages(): array
    {
        return [
            'sub_category_id.required'      => 'Please select a parent sub category.',
            'sub_category_id.exists'        => 'The selected sub category is invalid.',
            'childCategoryName_en.required' => 'Child Category Name in English is required.',
            'childCategoryName_ar.required' => 'Child Category Name in Arabic is required.',
            'memberPhoto.image'             => 'The uploaded file must be a valid image.',
            'memberPhoto.max'               => 'Image size must not exceed 2MB.',
        ];
    }
}
