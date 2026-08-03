<?php

declare(strict_types=1);

namespace App\Support;

trait HtmlSanitizer
{
    private function sanitizeHtml(string $html): string
    {
        return strip_tags($html, '<p><br><b><i><u><strong><em><h1><h2><h3><h4><h5><h6><ul><ol><li><a><img><span><div><blockquote><pre><code><table><thead><tbody><tr><th><td><hr>');
    }
}
