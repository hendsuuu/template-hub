{{-- The document: the Vite bundle (fonts, stylesheet), the sidebar restore script and ui.js. --}}
@props(['title', 'description' => 'Operations dashboard: agents, jobs, a kanban board and schedules.'])
<!DOCTYPE html>
<html lang="en-GB">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="dark">
        <meta name="theme-color" content="#252533">
        <meta name="description" content="{{ $description }}">
        <title>{{ $title }}</title>
        {{-- Restores a collapsed sidebar before the first paint. --}}
        <script>try{if(localStorage.getItem("ak:sidebar")==="collapsed")document.documentElement.dataset.akSidebar="collapsed"}catch(e){}</script>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
        <script src="{{ asset('ui.js') }}" defer></script>
    </head>
    <body>
        <div class="ak-root">{{ $slot }}</div>
    </body>
</html>
