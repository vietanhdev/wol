#include <EtherCard.h>
#include <Regexp.h>
#include <string.h>
#include <ctype.h>

#define MAX_PAGE_LEN 1000

// ethernet interface mac address, must be unique on the LAN
static byte mymac[] = { 0x74,0x69,0x69,0x2D,0x30,0x31 };
byte Ethernet::buffer[700];
static uint32_t timer;
const char website[] PROGMEM = "example.domain.com";

static void webpage_response_callback (byte status, word off, word len);


// called for each match
// After converting to mac address format, wake up the machines
void address_match_callback  (const char * match,          // matching string (not null-terminated)
                      const unsigned int length,   // length of matching string
                      const MatchState & ms)      // MatchState in use (to get captures)
{
  static byte mac_address[] = {0xB4,0x2E,0x99,0x49,0x74,0xF3};
  char mac_address_str [100];   // must be large enough to hold captures
  
  Serial.print ("Matched: ");
  Serial.write ((byte *) match, length);
  Serial.println ();
  
  for (byte i = 0; i < ms.level; i++)
    {
    Serial.print ("Capture "); 
    ms.GetCapture (mac_address_str, i);
    sscanf(mac_address_str, "%x:%x:%x:%x:%x:%x", &mac_address[0], &mac_address[1], &mac_address[2], &mac_address[3], &mac_address[4], &mac_address[5]);
    ether.sendWol(mac_address);

    Serial.println (mac_address_str); 
    }  // end of for each capture

}  // end of match_callback 



// called when the client request is complete
static void webpage_response_callback (byte status, word off, word len) {
  Serial.println(">>>");
  Ethernet::buffer[off+300] = 0;
  const char * page_content_window = (const char*) Ethernet::buffer + off;
  char page_content[MAX_PAGE_LEN];
  strncpy(page_content, page_content_window, strlen(page_content_window) + 1);

  // Convert all to uppercase
  char * p = page_content;
  while (*p) {
      *p = toupper(*p);
      p++;
  }
  
  Serial.println(page_content);
  

  // ==== Parse the webpage for wakeup command ====
  
  unsigned long count;
  // match state object
  MatchState ms (page_content);
  
  // Search for MAC address of machines that we have to wake up
  count = ms.GlobalMatch ("([0-9A-F][0-9A-F][:][0-9A-F][0-9A-F][:][0-9A-F][0-9A-F][:][0-9A-F][0-9A-F][:][0-9A-F][0-9A-F][:][0-9A-F][0-9A-F])", address_match_callback);

}


void setup () {
  Serial.begin(57600);
  Serial.println(F("\n[webClient]"));
  // Change 'SS' to your Slave Select pin, if you arn't using the default pin
  if (ether.begin(sizeof Ethernet::buffer, mymac, SS) == 0)
    Serial.println(F("Failed to access Ethernet controller"));
  if (!ether.dhcpSetup())
    Serial.println(F("DHCP failed"));
  ether.printIp("IP:  ", ether.myip);
  ether.printIp("GW:  ", ether.gwip);
  ether.printIp("DNS: ", ether.dnsip);
#if 1
  // use DNS to resolve the website's IP address
  if (!ether.dnsLookup(website))
    Serial.println("DNS failed");
#elif 2
  // if website is a string containing an IP address instead of a domain name,
  // then use it directly. Note: the string can not be in PROGMEM.
  char websiteIP[] = "192.168.1.1";
  ether.parseIp(ether.hisip, websiteIP);
#else
  // or provide a numeric IP address instead of a string
  byte hisip[] = { 192,168,1,1 };
  ether.copyIp(ether.hisip, hisip);
#endif
  ether.printIp("SRV: ", ether.hisip);
}


void loop () {
  ether.packetLoop(ether.packetReceive());
  if (millis() > timer) {
    timer = millis() + 5000;
    Serial.println();
    Serial.print("<<< REQ ");
    ether.browseUrl(PSTR("/api/"), "wol_command?client=wol_device", website, webpage_response_callback);
  }
}
  
