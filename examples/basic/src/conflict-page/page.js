import { html, render } from 'uhtml-ssr'

export default async function conflictPage () {
  return render(String, html`
    <div class='blue-text'>
      conflicting page
    </div>
`)
}
