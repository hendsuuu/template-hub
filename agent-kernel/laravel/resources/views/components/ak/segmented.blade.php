{{--
    Two or three options, exactly one on (e.g. Jobs / Spend). Native radios, so it
    needs no script: CSS shows the parts of the panel that belong to the checked one.
--}}
@props(['label', 'name', 'options', 'default'])
<div role="radiogroup" aria-label="{{ $label }}" class="ak-segmented">
    @foreach ($options as $value => $text)
        <span class="contents">
            <input type="radio" class="sr-only" id="{{ $name }}-{{ $value }}" name="{{ $name }}" value="{{ $value }}" data-ak-mode-input="{{ $value }}" @checked($value === $default)>
            <label for="{{ $name }}-{{ $value }}" class="ak-segmented__option">{{ $text }}</label>
        </span>
    @endforeach
</div>
