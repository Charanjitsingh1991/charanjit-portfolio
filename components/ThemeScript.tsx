export default function ThemeScript() {
  const code = `(function(){try{
    var s=localStorage.getItem('theme');
    var h=new Date().getHours();
    var t=(s==='light'||s==='dark')?s:((h>=7&&h<19)?'light':'dark');
    document.documentElement.setAttribute('data-theme',t);
    document.documentElement.setAttribute('data-role','dev');
  }catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
