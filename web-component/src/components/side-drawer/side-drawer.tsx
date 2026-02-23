import { Component, h, Method, Prop, State } from '@stencil/core/internal';

@Component({
  tag: 'uc-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true,
})
export class SideDrawer {
  @State() showContactInfo: boolean = false;
  @Prop({
    reflect: true,
  })
  mainTitle: string;
  @Prop({
    reflect: true,
    mutable: true,
  })
  opened: boolean;

  onCloseDrawer() {
    this.opened = false;
  }

  onContentChange(content: string) {
    this.showContactInfo = content === 'contact';
  }

  @Method()
  open() {
    this.opened = true;
  }
  render() {
    let mainContent = <slot />;
    if (this.showContactInfo) {
      mainContent = (
        <div id="contact-information">
          <p>This is the main content of the side drawer.</p>
          <p>It can be anything you want, including text, images, or other components.</p>
        </div>
      );
    }
    // return this.opened ? (
    //   <aside>
    //     <header>
    //       <h1>{this.mainTitle}</h1>
    //     </header>
    //     <main>
    //       <slot />
    //     </main>
    //   </aside>
    // ) : null;
    return [
      <div id="backdrop" onClick={() => this.onCloseDrawer()}></div>,
      <aside>
        <header>
          <h1>{this.mainTitle}</h1>
          <button onClick={() => this.onCloseDrawer()}>X</button>
        </header>
        <section id="tabs">
          <button class="active" onClick={() => this.onContentChange('nav')}>
            Navigation
          </button>
          <button onClick={() => this.onContentChange('contact')}>Contact</button>
        </section>
        <main>{mainContent}</main>
      </aside>,
    ];
  }
}
