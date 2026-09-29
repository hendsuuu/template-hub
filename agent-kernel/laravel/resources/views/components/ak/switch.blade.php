{{-- An on/off switch; ui.js flips it. --}}
@props(['checked' => false, 'label'])
<button type="button" role="switch" aria-checked="{{ $checked ? 'true' : 'false' }}" aria-label="{{ $label }}" class="ak-switch">
    <span class="ak-switch__track" aria-hidden="true"><span class="ak-switch__thumb"></span></span>
    <span class="ak-switch__text" aria-hidden="true"><span class="ak-switch__on">On</span><span class="ak-switch__off">Off</span></span>
</button>
