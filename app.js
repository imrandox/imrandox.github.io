//!function(){
navigator.spatialNavigationEnabled = false;
let id = null, note, coder, PX = 12, mian, barz, filex, apbdy, home, inpt, browser, qlu = true, ff = ()=>{}, homeKeys = ff, pas;

//KaiApp_Extractor....App for KaiOS phone

let intrvl = null, timeout = null, err = false, lh, uh, rh, fh, hl,
    apEx, root, loading, filer, bar, ul, list = null, len, sel = 0, pat = /\d+/, 
    pressed = false, _lxl = function(){}, folderArr = [], fileArr = [];

function _appDown(arr) {
	let len = arr.length,
  stp = 0,
	root = arr.shift(),
	nam = arr.shift(),
	validArr = [],
	types = {
		png: 'image/png',
		jpg: 'image/jpg',
		gif: 'image/gif',
		ogg: 'audio/ogg',
		wav: 'audio/wav',
		amr: 'audio/amr',
		mp3: 'audio/ma3',
		opus: 'audio/opus',
		aac: 'audio/aac',
		ttf: 'font/ttf',
		webp: 'image/webp'
	};
	arr.forEach((elem)=>{
		if(elem.indexOf('.') > -1 && elem[elem.length-1] != '/') {
			validArr.push(elem);
		}
	});
  len = validArr.length;
	_lxl = function() {
		if(validArr.length == 0) {
			_hide();
			return;
		}
		let name = validArr.shift(),
		ur = root + name,
		typ = name.substring(name.lastIndexOf('.')+1);
    stp++;
		if(Object.keys(types).indexOf(typ) > -1) {
			typ = {type: types[typ]};
		} else {
			typ = {type: 'text/plain'};
		}
		_loadNdown(name, ur, typ, nam);
    filer.style.width = ((stp / len) * 100) + '%';
	};
	_lxl();
}

function _loadNdown(name, url, type, nam) {
	const xhr = new XMLHttpRequest({mozSystem: true});
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = (e) => {
    let content = e.currentTarget.response,
	  blob = new Blob([content], type),
	  sdcard = navigator.getDeviceStorage("sdcard"),
		path = 'downloads/'+nam+'/'+name,
		request = sdcard.addNamed(blob, path);
		request.onsuccess = function () {_lxl()}
		request.onerror = function (e) {
		  _lxl();
		}
  }
	xhr.onerror = (err) => {
    _lxl();
  }
	xhr.send();
}

function _hide(s='Completed!') {
  filer.style.width = '100%';
  filer.innerText = s;
  setTimeout(()=>{
    loading.style.display = 'none';
    filer.innerText = '';
    filer.style.width = '1%';
  }, 2e3);
}

function _folderNfileStore(str='') {
	let tempArr = str.split('\n'),
	elem1 = tempArr.shift(),
	path = elem1.substring(elem1.lastIndexOf('!/')+2);
	tempArr.shift();
	tempArr.forEach((elem)=>{
		elem = elem.replace('201: ','').replace(/\s\d.+/i, '');
		if(elem.includes('/')) {
			folderArr.push(path+elem);
		} else {
			fileArr.push(path+elem);
		}
	});
	if(folderArr.length == 0) {
		_appDown(fileArr);
	} else {
		_appCatcher(fileArr[0]+folderArr.shift());
	}
} 

function _appURLcatcher(url, nam) {
	let appURL = url+'/';
  _loading();
	fileArr = [];
	fileArr[0] = appURL;
	fileArr[1] = nam;
	_appCatcher(appURL);
}

function appExtract() {
  loading.style.display = 'block';
  filer.style.width = '100%';
  filer.innerHTML = 'Loading...';
  intrvl = setTimeout(()=>{
    xtractErr();
  }, 5000);
  let iframe = document.createElement('iframe'),
  ur = localStorage.getItem('ul') || 'https://www.google.com/search?q=1',
  p = ur.split('='), q = p[1];
  q = +q; q++;
  ur = p[0].concat('=', q);
  localStorage.setItem('ul', ur);
  iframe.setAttribute('mozbrowser', true);
  iframe.setAttribute('remote', true);
  iframe.src = ur;
  iframe.addEventListener('mozbrowserloadstart', ()=>{});
  iframe.addEventListener('mozbrowserloadend', ()=>{
    setTimeout(()=>{
      if(err) {}
      else {
        _appsList();
      }
    }, 300);
  });
  iframe.addEventListener('mozbrowsererror', xtractErr.bind(null));
  document.querySelector('#hidden').appendChild(iframe);
}

function xtractErr() {
  err = !0;
  loading.style.display = 'none';
  clearInterval(intrvl);
  let er = document.querySelector('#xerror');
  er.style.display = "block";
  window.removeEventListener('keydown', keys);
  setTimeout(()=>{
    window.close();
  }, 5e3);
}

function _appCatcher(url) {
	const xhr = new XMLHttpRequest({mozSystem: true});
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  xhr.onload = (e) => {
    _folderNfileStore(e.currentTarget.response);
  }
	xhr.onerror = (err) => {
	  _hide('Error!')
  }
	xhr.send();
}

function _appsList() {
	let req = navigator.mozApps.mgmt.getAll();
	req.onsuccess = () => {
		let apps = req.result, arrNamed = [];
    for(let i = apps.length-1; i > -1; i--) {
      let nam = [apps[i].manifest.name, i];
      arrNamed.push(nam);
    }
    arrNamed.sort();
		while(arrNamed.length>0){
      let indx = arrNamed.shift(), app = apps[indx[1]], li = document.createElement('li'),
      ori = app.origin, name = app.manifest.name, ico = app.manifest.icons;
			for(let _ in ico){ico=ico[_];break;}
			li.innerHTML = `<img src="${ori+ico}"><name>${name}</name>`;
      li.setAttribute('data-ap', ori);
			ul.appendChild(li);
		}
    apEx.style.display = "block";
    filer.style.width = '1%';
    listIndex();
	}
}

function listIndex() {
  list = document.querySelectorAll('li');
  list.length || (list = document.querySelectorAll('.item'));
  len = list.length; sel = 0;
  list[sel].setAttribute('sel','');
  if(list[0].tagName == 'DIV')return;
  lh = list[0].offsetHeight, hl = lh * -1, uh = len * lh, rh = lh * 5, fh = innerHeight - rh;
  list.forEach((li)=>{
    li.style.height = lh+'px';
  });
  bar.style.height = lh+'px';
  bar.style.top = '0px';
  barz.style.top = '0px';
  barz.style.height = lh+'px';
  root.style.height = rh+'px';
  document.querySelector('#footer').style.height = fh+'px';
}

function keyPressed(n) {
  if(!pressed) {
    return
  }
  if(!!n) {
    let tp = pat.exec(bar.style.top);
    tp = +tp[0] + lh;
    if(tp>=rh) {
      ul.scrollBy(0, lh);
    } else {
      bar.style.top = tp+'px';
    }
    list[sel++].removeAttribute('sel');
    sel = sel >= len ? len-1 : sel;
    list[sel].setAttribute('sel','');
  } else {
    let tp = pat.exec(bar.style.top);
    tp = +tp[0] - lh;
    if(tp<0) {
      ul.scrollBy(0, hl);
    } else {
      bar.style.top = tp+'px';
    }
    list[sel--].removeAttribute('sel');
    sel = sel < 0 ? 0 : sel;
    list[sel].setAttribute('sel','');
  }
  timeout = setTimeout(()=>{
    keyPressed(n);
  }, 450);
}

function keys(ev) {
  ev.preventDefault();
  pressed = true;
  switch(ev.key) {
    case "ArrowDown": {
      keyPressed(1);
      break;
    }
    case "ArrowUp": {
      keyPressed(0);
      break;
    }
    case "SoftRight":
    case "Backspace": {
      apbdy.style.display = 'block';
      apEx.style.display = 'none';
      ul.innerHTML = '';
      listIndex();
      window.removeEventListener('keydown', keys);
      window.addEventListener('keydown', mainKeys);
      window.removeEventListener('keyup', keyUp);
      break;
    }
    case "Enter": {
      let ur = list[sel].getAttribute('data-ap'), nam = list[sel].children[1].innerHTML;
      _appURLcatcher(ur, nam);
      break;
    }
    case "SoftLeft": {
      window.removeEventListener('keydown', keys);
      window.removeEventListener('keyup', keyUp);
      apEx.style.display = 'none';
      browser(list[sel].getAttribute('data-ap'), 'apEx');
      break;
    }
  }
}

function keyUp() {
  pressed = false;
  clearTimeout(timeout);
}

function _loading() {
  loading.style.display = 'block';
  filer.style.width = '1%';
}

//End KaiAppExtractor

function bat() {
	let v = window.navigator.battery || {level:0.5};
	let d = "Energy: "+parseInt(v.level*100)+"%";
	return d;
}

function wifi() {
	navigator.mozSettings.createLock().set({'wifi.enabled':true});
	try {
		let manager = navigator.mozWifiManager;
		let net = manager.getKnownNetworks();
		net.onsuccess = function(){
			let network = this.result[0];
			let rex = manager.setStaticIpMode(network, {"enabled":true,"ipaddr":"192.168.1.6","proxy":"","maskLength":24,"gateway":"192.168.1.1","dns1":"9.9.9.9","dns2":"8.8.4.4"});
			rex.onsuccess = function(){};
			rex.onerror = function(){};
		}
	} catch(e){}
}

function addCode(ev) {
	ev.preventDefault();
	ex();
	let obj = ev.target.files[0];
	var reader = new FileReader();
	reader.onload = function() {
		coder.value = reader.result;
	}
	reader.onerror = function() {
	}
	reader.readAsText(obj);
}

function runner() {
	document.body.removeChild(document.querySelector('script.sc'));
	let code = coder.value,
	sc = document.createElement('script');
	code = 'try{' + code + '}catch(e){alert(e)}';
	let blob = new Blob([code], {type:'application/javascript'}),
	url = URL.createObjectURL(blob);
	sc.setAttribute('class','sc');
	sc.setAttribute('src',url);
	document.body.appendChild(sc);
}

browser = function(_urx, cond) {
  navigator.spatialNavigationEnabled = true;
  
  let iframe = document.createElement('iframe'), container = document.querySelector('#container'), r1 = container.createShadowRoot(), r2 = container.createShadowRoot(), shadow = document.createElement('shadow'), vol = 3, url, iframeTimer = null, slider = document.querySelector('.slider'), zm = 0.70, title;
  
  ff = function(ev) {
    ev.preventDefault();
    switch(ev.key) {
      case 'Backspace': {
        iframe.goBack();
        break;
      }
      case '1': {
        zm = zm*10-1;
        zm<1?(zm = 1):zm;
        zm/=10;
        iframe.zoom(zm);
        break;
      }
      case '2': {
        iframe.zoom(zm=0.70);
        break;
      }
      case '3': {
        zm = zm*10+1;
        zm>20?(zm = 20):zm;
        zm/=10;
        iframe.zoom(zm);
        break;
      }
      case '4': {
        iframe.scrollToTop();
        break;
      }
      case '5': {
        iframe.reload();
        break;
      }
      case '6': {
        iframe.scrollToBottom();
        break;
      }
      case '7': {
        if(confirm('Clear History?')) {
          localStorage.clear()
        }
        break;
      }
      case '8': {
        let ln = localStorage.length, s = '</ol>';
        while(ln>=0){
          ln--;
          let k = localStorage.key(ln),
          v = localStorage.getItem(k);
          s = `<li><a href="${k}">${v}</a></li>` + s;
        }
        s = '<style>a{font-size:17px;padding:5px 3px;text-decoration:none;}</style><ol>'+s;
        let blob = new Blob([s], {type:'text/html'}),
        u = URL.createObjectURL(blob);
        iframe.src = u;
        break;
      }
      case 'Call': {
        navigator.spatialNavigationEnabled = false;
        clearInterval(iframeTimer);
        container.style.display = "none";
        if(cond=='apEx') {
          apEx.style.display = "block";
          window.addEventListener('keydown', keys);
          window.addEventListener('keyup', keyUp);
          window.removeEventListener('keydown', ff);
        } else {
          home.style.display = 'block';
          inpt.value = url;
          inpt.select();
          window.removeEventListener('keydown', ff);
          window.addEventListener('keydown', homeKeys);
        }
        break;
      }
      case 'SoftLeft': {
        if(iframe.hasAttribute('landscap')) {
          navigator.spatialNavigationEnabled = true;
          iframe.removeAttribute('landscap');
          iframe.setAttribute('style', 'background:white;color:black;width:240px;height:320px;border:none; margin:0;padding:0;');
        } else{
          navigator.spatialNavigationEnabled = false;
          iframe.setAttribute('landscap','');
          iframe.setAttribute('style', 'width:320px;height:240px;border:none;transform:rotate(90deg);position:relative;top:40px;left:-40px;');
        }
        break;
      }
      case '*': {
        --vol;
        vol = vol < 0 ? 0:vol;
        navigator.mozSettings.createLock().set({'audio.volume.content':vol});
        break;
      }
      case '#': {
        ++vol;
        vol = vol > 14 ? 14:vol;
        navigator.mozSettings.createLock().set({'audio.volume.content':vol});
        break;
      }
      case '0': {
        vol = 0;
        navigator.mozSettings.createLock().set({'audio.volume.content':vol});
        break;
      }
      default:iframe.blur();break;
    }
  }
  
  home.style.display = 'none';
  container.style.display = "block";
  iframe.setAttribute('mozbrowser', true);
  iframe.setAttribute('mozallowfullscreen', true);
  iframe.setAttribute('mozapp', true);
  iframe.setAttribute('remote', true);
  iframe.setAttribute('frameBorder', '0');
  iframe.setAttribute('style', 'background:white;color:black;width:240px;height:320px;border:none; margin:0;padding:0;');
  iframe.src = _urx;
  r1.appendChild(iframe);
  r2.appendChild(shadow);
  
  iframe.zoom(zm);
  iframe.addEventListener('mozbrowserloadstart', _load);
  iframe.addEventListener('mozbrowserloadend', _loadend);
  iframe.addEventListener('mozbrowsertitlechange', (e)=>{title = e.detail,iframe.blur()});
  iframe.addEventListener('mozbrowserlocationchange', (e)=>{url = e.detail.url,iframe.blur()});
  iframe.addEventListener('mozbrowsererror', ()=>{iframe.blur()});
  iframe.addEventListener('mozbrowsercontextmenu', ()=>{iframe.blur()});
  window.addEventListener('keydown', ff);

  navigator.mozSettings.createLock().set({'audio.volume.content':3});
  iframe.blur();
  qlu = false;
  iframeTimer = setInterval(() => {
    if (document.activeElement.tagName === 'IFRAME') {
      navigator.spatialNavigationEnabled = true;
    }
  }, 500);
  
  function _load(e) {
    slider.style.display = 'block';
    iframe.blur();
    timeout = setTimeout(_loadend, 15e3);
  }
  function _loadend(e) {
    clearTimeout(timeout);
    slider.style.display = 'none';
    if(url.startsWith('http')) {
      localStorage.setItem(url, title);
    }
    iframe.blur();
  }

}

function browxer() {
  apbdy.style.display = 'none';
  home.style.display = 'block';
  let imgs = document.querySelectorAll('#browser img'), step = 0;
  
  homeKeys = function(e) {
    e.preventDefault();
    switch(e.key) {
      case 'Backspace': {
        navigator.spatialNavigationEnabled = false;
        apbdy.style.display = 'block';
        home.style.display = 'none';
        window.removeEventListener('keydown', homeKeys);
        window.addEventListener('keydown', mainKeys);
        break;
      }
      case 'ArrowRight': {
        if(inpt.hasAttribute('class')) {
        } else {
          for(let img, i = 0; i < 6; i++) {
            img = imgs[i];
            if(img.hasAttribute('class')) {
              ++i;
              i = i>5?5:i;
              img.removeAttribute('class');
              imgs[i].setAttribute('class', 'foc');
              break;
            }
          }
        }
        break;
      }
      case 'ArrowLeft': {
        if(inpt.hasAttribute('class')) {
        } else {
          for(let img, i = 0; i < 6; i++) {
            img = imgs[i];
            if(img.hasAttribute('class')) {
              --i;
              i = i<0?0:i;
              img.removeAttribute('class');
              imgs[i].setAttribute('class', 'foc');
              break;
            }
          }
        }
        break;
      }
      case 'ArrowDown': {
        if(inpt.hasAttribute('class')) {
          inpt.removeAttribute('class');
          imgs[0].setAttribute('class', 'foc');
        } else {
          for(let img, i = 0; i < 6; i++) {
            img = imgs[i];
            if(img.hasAttribute('class')) {
              i += 3;
              i = i>5?i-3:i;
              img.removeAttribute('class');
              imgs[i].setAttribute('class', 'foc');
              break;
            }
          }
        }
        break;
      }
      case 'ArrowUp': {
        if(inpt.hasAttribute('class')) {
        } else {
          for(let img, i = 0; i < 6; i++) {
            img = imgs[i];
            if(img.hasAttribute('class')) {
              i -= 3;
              i<0?(img.removeAttribute('class'),inpt.setAttribute('class', 'foc'),inpt.select()):(img.removeAttribute('class'),imgs[i].setAttribute('class', 'foc'));
              break;
            }
          }
        }
        break;
      }
      case 'Enter': {
        for(let img, i = 0; i < 6; i++) {
          img = imgs[i];
          if(img.hasAttribute('class')) {
            let ur = img.getAttribute('data-url');
            img.removeAttribute('class');
            inpt.setAttribute('class', 'foc');
            browser(ur, 'hmmm');
            window.removeEventListener('keydown', homeKeys);
            break;
          }
        }
        break;
      }
      case 'Call': {
        if(qlu)return;
        navigator.spatialNavigationEnabled = true;
        home.style.display = 'none';
        container.style.display = "block";
        window.removeEventListener('keydown', homeKeys);
        window.addEventListener('keydown', ff);
        break;
      }
    }
  }
  
  executed();
  function executed() {
    navigator.spatialNavigationEnabled = false;
    window.addEventListener('keydown', homeKeys);
    inpt.focus();
    inpt.addEventListener('keydown', (e)=>{
      e.stopPropagation();
      navigator.spatialNavigationEnabled = false;
      if(e.key == 'Enter' && inpt.value) {
        let ur = inpt.value;
        inpt.value = '';
        inpt.blur();
        ur = ur.startsWith('@') ? ur.replace('@', 'app://'):ur;
        if(validURL(ur)) {
          ur = ur.startsWith('http') ? ur:ur.startsWith('app') ? ur:'https://'+ur;
          browser(ur, 'hh')
        } else {
          browser('https://google.com/search?q=' + ur, 'hh');
        }
        window.removeEventListener('keydown', homeKeys);
        return;
      }
      if(e.key == 'SoftRight') {
        inpt.select();
        return;
      }
      if(e.key == 'ArrowDown') {
        inpt.blur();
        inpt.removeAttribute('class');
        imgs[0].setAttribute('class', 'foc');
        return;
      }
    });
  }

  function validURL(str) {
    var pattern = new RegExp('^((app|https?):\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');
    return !!pattern.test(str);
  }

}

function log(s='') {note.innerHTML = s;}
function logp(s='') {
  let div = document.createElement('div');
  div.innerHTML = s;
  note.appendChild(div);
}
function ex(t='') {coder.value = t;}

function editorKeys(ev) {
	ev.preventDefault();
	let ky = ev.key;
	switch(ky) {
		case 'Call': runner(); break;
		case 'Backspace': {
      navigator.spatialNavigationEnabled = false;
      apbdy.style.display = 'block';
      coder.parentElement.style.display = 'none';
      window.removeEventListener('keydown', editorKeys);
      window.addEventListener('keydown', mainKeys);
      break;
    }
		case '*': down();break;
		case 'SoftLeft':loax();break;
		case 'SoftRight':filex.click();break;
		case '2': {
			coder.scrollBy(0,-300);
			break;
		}
		case '8': {
			coder.scrollBy(0,300);
			break;
		}
		case '#': {
			let pr = note.parentElement;
			if(pr.style.display=='none') {pr.style.display = 'block';}
			else {pr.style.display = 'none';}
			break;
		}
		default:break;
	}
}

function loax(url="popbd.wapgem.com/TEST.js") {
  _loading();
  url = url.includes('http')?url:'https://'+url;
	const xhr = new XMLHttpRequest({mozSystem: true});
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  xhr.onload = (e) => {
    ex(e.currentTarget.response);
    _hide();
  }
  xhr.onprogress = (e)=>{
    if (e.lengthComputable) {
      let prog = e.loaded / e.total * 100;
      filer.style.width = prog+'%';
    } else {
      filer.style.width = '100%';
    }
  }
	xhr.onerror = (err) => {
    log(JSON.stringify(err));
	  _hide('Error!')
  }
	xhr.send();
}

function down() {
  try{
  _loading();
	let stp = 0,
	content = coder.value,
	blob = new Blob([content], {type:"text/plain"}),
	sdcard = navigator.getDeviceStorage("sdcard");
	function req(ext) {
		request = sdcard.addNamed(blob, "/sdcard/downloads/text"+ext+".png");
		request.onsuccess = function () {
		  _hide();
		}
		request.onerror = function () {
		  stp++;
		  if(stp<51) {
			req('_'+stp);
		  }else {
			log('Unable to save file');
      _hide('Error!');
		  }
		}
	}
	req('');
  }catch(e) {
	log(e);
  _hide('Error!');
  }
}

function coderKeys(ev) {
	ev.stopPropagation();
	switch(ev.key) {
		case 'Call': case 'CapsLock':ev.target.blur(); break;
    case 'SoftLeft': ev.target.style.fontSize = --PX + 'px'; break;
    case 'SoftRight': ev.target.style.fontSize = ++PX + 'px'; break;
		default:break;
	}
}

function str(obj) {
  let s = '';
  for(let i in obj){
    s += i + ': ' + obj[i] + '\n';
  }
  ex(s);
}

function editor() {
  window.addEventListener('keydown', editorKeys);
  navigator.spatialNavigationEnabled = true;
  apbdy.style.display = 'none';
  coder.parentElement.style.display = 'block';
}

function fileMan() {
  
}

function control() {
  
}

function appEx() {
  apbdy.style.display = 'none';
  window.addEventListener('keydown', keys);
  window.addEventListener('keyup', keyUp);
  ul.innerHTML = ``;
  apEx.style.display = "block";
  _appsList();
}

function mainKeys(ev) {
  ev.preventDefault();
  pressed = true;
  switch(ev.key) {
    case "ArrowDown": {
      let tp = pat.exec(barz.style.top);
      tp = +tp[0] + 57;
      tp = tp>228?228:tp;
      barz.style.top = tp+'px';
      list[sel++].removeAttribute('sel');
      sel = sel >= len ? len-1 : sel;
      list[sel].setAttribute('sel','');
      break;
    }
    case "ArrowUp": {
      let tp = pat.exec(barz.style.top);
      tp = +tp[0] - 57;
      tp = tp<0?0:tp;
      barz.style.top = tp+'px';
      list[sel--].removeAttribute('sel');
      sel = sel < 0 ? 0 : sel;
      list[sel].setAttribute('sel','');
      break;
    }
    case "SoftRight":
    case "Backspace": {
      window.close();
      break;
    }
    case "Enter": {
      try{
      let fn = list[sel].getAttribute('data-fn');
      switch(fn) {
        case 'editor': editor(); break;
        case 'browxer': browxer(); break;
        case 'cntrl': control(); break;
        case 'appEx': appEx(); break;
        case 'fileMan': fileMan(); break;
      }} catch(e){return}
      window.removeEventListener('keydown', mainKeys);
      break;
    }
  }
}

function main(inpt) {
  mian.style.display = 'block';
  inpt.parentElement.style.display = 'none';
  listIndex();
  window.addEventListener('keydown', mainKeys);
}

function onInput(ev) {
	if(ev.target.value === 'Amdp') {
		ev.stopPropagation();
		main(ev.currentTarget);
    pas.parentElement.removeChild(pas);
	} else {return}
}

window.onload = () => {
  pas = document.querySelector('#pass');
  pas.focus();
  mian = document.querySelector('#main'),
  filex = document.querySelector('#filex'),
  apbdy = document.querySelector('#appbody'),
  apEx = document.querySelector('#appEx'),
  root = document.querySelector('#root'),
  loading = document.querySelector('#loading'),
  coder = document.querySelector('#coder'),
  filer = document.querySelector('#filler'),
  bar = document.querySelector('#barx'),
  barz = document.querySelector('#barz'),
  ul = document.querySelector('ul'),
  home = document.querySelector('#browser'),
  inpt = document.querySelector('#URL'),
  note = document.getElementById('log');
  pas.addEventListener("keydown",onInput);
  barz.style.top = '0px';
  bar.style.top = '0px';
  coder.addEventListener("keydown",coderKeys);
  filex.addEventListener("change",addCode);
};

//}();

