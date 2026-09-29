{{-- A sortable column header's button; ui.js sorts the table when it is pressed. --}}
<button type="button" class="ak-sort">
    {{ $slot }}
    <x-ak.icon name="chevrons-up-down" :size="12" class="ak-sort__icon ak-sort__icon--none" />
    <x-ak.icon name="chevron-up" :size="12" class="ak-sort__icon ak-sort__icon--asc" />
    <x-ak.icon name="chevron-down" :size="12" class="ak-sort__icon ak-sort__icon--desc" />
</button>
